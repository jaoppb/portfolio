#!/usr/bin/env node
/**
 * Checks what the live production hosts answer: redirects, indexing state, SEO files, the
 * OG images and every same-site link of the pages (docs/workflows/launch.md). Read-only.
 *
 *   QUALITY_TARGET=production QUALITY_EXPECT=noindex|indexable node quality/live-check.mjs
 */
import assert from "node:assert/strict";
import { appendFileSync } from "node:fs";
import target from "./target.cjs";

if (!target.live) {
	console.error("live-check only runs against production: set QUALITY_TARGET=production.");
	process.exit(2);
}
const { indexable, paths, defaultPath, urlOf } = target;
const { site, www, pagesDev } = target.production;
const TIMEOUT_MS = 20_000;
const PNG_SIGNATURE = "89504e470d0a1a0a";
/** What sites such as LinkedIn answer to a request that does not come from a browser. */
const REFUSED = [401, 403, 429, 999];

/** A network error names the URL: one row covers many requests. */
const request = (url, redirect) =>
	fetch(url, { redirect, signal: AbortSignal.timeout(TIMEOUT_MS) }).catch((error) => {
		throw new Error(`${url} did not answer: ${error.message}`);
	});

/** Never follows a redirect: a redirect is a result to check, not a step to skip. */
const get = (url) => request(url, "manual");

async function getOk(url, contentType) {
	const response = await get(url);
	assert.equal(response.status, 200, `${url} answered ${response.status}`);
	const type = response.headers.get("content-type") ?? "";
	assert.ok(type.startsWith(contentType), `${url} is "${type}", expected ${contentType}`);
	return response;
}

async function expectRedirect(url, statuses, locations) {
	const response = await get(url);
	assert.ok(statuses.includes(response.status), `${url} answered ${response.status}`);
	const actual = new URL(response.headers.get("location") ?? "", url).href;
	assert.ok(locations.includes(actual), `${url} redirects to ${actual}`);
	return `${response.status} to ${actual}`;
}

const attribute = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]);
const hasNoindex = (html) => /<meta\b[^>]*\bnoindex\b/i.test(html);
const hasCanonical = (html, url) => html.includes(`<link rel="canonical" href="${url}"/>`);

/** Every http(s) link of a page, without fragments and without the page itself. */
function linksOf(html, pageUrl) {
	const links = attribute(html, /<a\b[^>]*\bhref="([^"]+)"/g)
		.map((href) => new URL(href.replaceAll("&amp;", "&"), pageUrl))
		.filter((url) => url.protocol === "https:" || url.protocol === "http:")
		.map((url) => url.origin + url.pathname + url.search);
	return [...new Set(links)].filter((url) => url !== pageUrl);
}

/** A link of the site must answer 200 itself, and a PDF must be one. */
async function checkOwnLink(url) {
	const isPdf = url.endsWith(".pdf");
	const response = await getOk(url, isPdf ? "application/pdf" : "text/html");
	if (isPdf) assert.ok((await response.text()).startsWith("%PDF-"), `${url} is not a PDF`);
}

/** A link to another site may redirect. Returns false when the site refuses to be checked. */
async function checkExternalLink(url) {
	const response = await request(url, "follow");
	if (REFUSED.includes(response.status)) return false;
	assert.ok(response.ok, `${url} answered ${response.status}`);
	return true;
}

async function checkPage(pagePath) {
	const url = urlOf(pagePath);
	const response = await getOk(url, "text/html");
	assert.equal(response.headers.get("x-robots-tag"), null, `${url} sends X-Robots-Tag`);
	const html = await response.text();
	// Zone features such as Email Address Obfuscation rewrite the HTML at the edge.
	assert.ok(!html.includes("/cdn-cgi/"), `${url} is rewritten by Cloudflare (/cdn-cgi/)`);

	const robots = attribute(html, /<meta name="robots" content="([^"]*)"/g);
	assert.deepEqual(robots, indexable ? [] : ["noindex, nofollow"], `${url} robots meta`);
	assert.equal(hasNoindex(html), !indexable, `${url} noindex in a meta tag`);
	assert.ok(hasCanonical(html, url), `${url} canonical`);
	for (const [hreflang, alternate] of [
		["x-default", urlOf(defaultPath)],
		...paths.map((path) => [path.slice(1), urlOf(path)]),
	]) {
		assert.ok(
			html.includes(`<link rel="alternate" hrefLang="${hreflang}" href="${alternate}"/>`),
			`${url} hreflang ${hreflang}`,
		);
	}
	const [jsonLd] = attribute(html, /<script type="application\/ld\+json">(.*?)<\/script>/gs);
	const person = JSON.parse(jsonLd ?? "null");
	assert.equal(person?.["@type"], "Person", `${url} JSON-LD type`);
	assert.equal(person.url, url, `${url} JSON-LD url`);

	const [ogImage] = attribute(html, /<meta property="og:image" content="([^"]+)"/g);
	assert.ok(ogImage?.startsWith(`${url}/opengraph-image`), `${url} og:image is ${ogImage}`);
	const image = Buffer.from(await (await getOk(ogImage, "image/png")).arrayBuffer());
	assert.equal(image.subarray(0, 8).toString("hex"), PNG_SIGNATURE, `${ogImage} is not a PNG`);

	const links = linksOf(html, url);
	const refused = [];
	for (const link of links) {
		if (new URL(link).origin === site) await checkOwnLink(link);
		else if (!(await checkExternalLink(link))) refused.push(link);
	}
	const unchecked = refused.length > 0 ? `; refused a check: ${refused.join(", ")}` : "";
	return `canonical, hreflang, JSON-LD, PNG OG image, ${links.length - refused.length} of ${links.length} links answer${unchecked}`;
}

async function checkNotFound(pagePath) {
	const url = urlOf(pagePath);
	const response = await get(url);
	assert.equal(response.status, 404, `${url} answered ${response.status}`);
	// The 404 pages are noindex in every state.
	assert.ok(hasNoindex(await response.text()), `${url} robots meta`);
	return "404, noindex";
}

async function checkRobots() {
	const text = await (await getOk(urlOf("/robots.txt"), "text/plain")).text();
	const expected = indexable
		? `User-Agent: *\nAllow: /\n\nSitemap: ${urlOf("/sitemap.xml")}\n`
		: "User-Agent: *\nDisallow: /\n\n";
	assert.equal(text, expected);
	return indexable ? "allows all, names the sitemap" : "disallows all";
}

async function checkSitemap() {
	const xml = await (await getOk(urlOf("/sitemap.xml"), "application/xml")).text();
	const listed = attribute(xml, /<loc>([^<]*)<\/loc>/g);
	assert.deepEqual(listed, indexable ? paths.map(urlOf) : []);
	return listed.length > 0 ? listed.join(", ") : "empty";
}

/** The production deploy on its pages.dev host: same HTML, kept out of the index by a header. */
async function checkPagesDev() {
	const url = `${pagesDev}${defaultPath}`;
	const response = await getOk(url, "text/html");
	assert.equal(response.headers.get("x-robots-tag"), "noindex", `${url} X-Robots-Tag`);
	assert.ok(hasCanonical(await response.text(), urlOf(defaultPath)), `${url} canonical`);
	return `200, X-Robots-Tag: noindex, canonical on ${site}`;
}

const insecure = (url) => url.replace("https://", "http://");
const checks = [
	[
		"/ redirects to the default locale",
		() => expectRedirect(urlOf("/"), [302], [urlOf(defaultPath)]),
	],
	[
		"www redirects to the apex, path and query kept",
		() =>
			expectRedirect(
				`${www}${defaultPath}?probe=1`,
				[301],
				[urlOf(`${defaultPath}?probe=1`)],
			),
	],
	...[site, www].map((host) => [
		`${insecure(host)} redirects to https`,
		// On www either rule may answer first: the upgrade to https or the redirect to the apex.
		() => expectRedirect(`${insecure(host)}/`, [301, 308], [`${host}/`, `${site}/`]),
	]),
	...paths.map((pagePath) => [`${pagePath} page`, () => checkPage(pagePath)]),
	["robots.txt", checkRobots],
	["sitemap.xml", checkSitemap],
	["unknown path", () => checkNotFound("/launch-check-missing")],
	...paths.map((path) => [
		`unknown path under ${path}`,
		() => checkNotFound(`${path}/launch-check-missing`),
	]),
	["pages.dev host is not indexable", checkPagesDev],
];

const rows = [];
let failed = false;
for (const [name, run] of checks) {
	try {
		rows.push(`| ${name} | ok | ${await run()} |`);
	} catch (error) {
		failed = true;
		rows.push(`| ${name} | **FAILED** | ${String(error.message).replaceAll("\n", " ")} |`);
	}
}

const markdown = [
	`### Live checks (${site}, expected ${indexable ? "indexable" : "noindex"}): ${failed ? "FAILED" : "passed"}`,
	"",
	"| Check | Result | Detail |",
	"| :--- | :--- | :--- |",
	...rows,
	"",
].join("\n");
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
process.exit(failed ? 1 : 0);
