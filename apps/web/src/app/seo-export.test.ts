// @vitest-environment node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Builds the real static export twice (indexable and preview/noindex) and checks the
 * emitted files, since sitemap, robots, icons and JSON-LD only exist after `next build`.
 */
const root = path.resolve(import.meta.dirname, "../..");
const SITE_URL = "https://seo-test.example";
const BUILD_TIMEOUT = 240_000;

function build(mode: "indexable" | "noindex") {
	const dir = path.join(".export-test", mode);
	// Drop NODE_ENV (vitest sets "test") and any inherited flag; `next build` sets its own.
	const { NODE_ENV: _nodeEnv, NEXT_PUBLIC_ROBOTS_NOINDEX: _flag, ...inherited } = process.env;
	const env = {
		...inherited,
		NEXT_PUBLIC_SITE_URL: SITE_URL,
		NEXT_EXPORT_DIR: dir,
		...(mode === "noindex" ? { NEXT_PUBLIC_ROBOTS_NOINDEX: "1" } : {}),
	} as unknown as NodeJS.ProcessEnv; // Next types make NODE_ENV required, but we omit it on purpose
	execFileSync("pnpm", ["build"], { cwd: root, env, stdio: "pipe" });
	const out = path.join(root, dir);
	return {
		has: (file: string) => existsSync(path.join(out, file)),
		read: (file: string) => readFileSync(path.join(out, file), "utf8"),
	};
}

type Export = ReturnType<typeof build>;
const jsonLd = (html: string) => {
	const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
	return JSON.parse(match?.[1] ?? "null");
};

describe("static export: indexable (production)", () => {
	let out: Export;
	beforeAll(() => {
		out = build("indexable");
	}, BUILD_TIMEOUT);

	it("emits an allow-all robots.txt pointing to the sitemap", () => {
		expect(out.read("robots.txt")).toBe(
			`User-Agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
		);
	});

	it("emits a sitemap with both locales and hreflang alternates", () => {
		const xml = out.read("sitemap.xml");
		for (const lang of ["en", "pt"]) {
			expect(xml).toContain(`<loc>${SITE_URL}/${lang}</loc>`);
			expect(xml).toContain(`hreflang="${lang}" href="${SITE_URL}/${lang}"`);
		}
		expect(xml).toContain(`hreflang="x-default" href="${SITE_URL}/en"`);
		expect(xml).not.toContain("<lastmod>");
		expect(xml).not.toContain(`<loc>${SITE_URL}</loc>`);
	});

	it.each(["en", "pt"])("%s page has valid Person JSON-LD, OG image and no noindex", (lang) => {
		const html = out.read(`${lang}.html`);
		expect(jsonLd(html)).toMatchObject({
			"@context": "https://schema.org",
			"@type": "Person",
			name: "João Pedro",
			url: `${SITE_URL}/${lang}`,
			sameAs: [
				"https://github.com/jaoppb",
				"https://linkedin.com/in/joao-pedro-peres-barbosa",
			],
		});
		expect(html).toContain(
			`<meta property="og:image" content="${SITE_URL}/${lang}/opengraph-image`,
		);
		expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest"/>');
		expect(html).not.toContain('name="robots"');
	});

	it("emits the OG image as a 1200x630 PNG", () => {
		const buf = readFileSync(path.join(root, ".export-test/indexable/en/opengraph-image"));
		expect(buf.subarray(1, 4).toString()).toBe("PNG");
		expect(buf.readUInt32BE(16)).toBe(1200);
		expect(buf.readUInt32BE(20)).toBe(630);
	});

	it("emits the icon set and a manifest that references existing icons", () => {
		for (const file of ["favicon.ico", "icon.svg", "apple-icon.png"]) {
			expect(out.has(file)).toBe(true);
		}
		const manifest = JSON.parse(out.read("manifest.webmanifest"));
		expect(manifest.icons.length).toBeGreaterThan(0);
		for (const icon of manifest.icons) {
			expect(out.has(icon.src.slice(1))).toBe(true);
		}
	});
});

describe("static export: preview (NEXT_PUBLIC_ROBOTS_NOINDEX=1)", () => {
	let out: Export;
	beforeAll(() => {
		out = build("noindex");
	}, BUILD_TIMEOUT);

	it("disallows everything and omits the Sitemap line", () => {
		expect(out.read("robots.txt")).toBe("User-Agent: *\nDisallow: /\n\n");
	});

	it("publishes an empty sitemap with no URLs", () => {
		expect(out.read("sitemap.xml")).not.toContain("<loc>");
	});

	it.each(["en.html", "pt.html", "index.html"])("%s carries noindex, nofollow", (file) => {
		expect(out.read(file)).toContain('<meta name="robots" content="noindex, nofollow"/>');
	});
});

afterAll(() => {
	rmSync(path.join(root, ".export-test"), { recursive: true, force: true });
});
