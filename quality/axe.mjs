#!/usr/bin/env node
/**
 * Runs axe-core in a real Chrome on every page of the matrix (see axe-report.mjs) and
 * fails on any violation. Expects the site to be served already: use with-server.mjs.
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import axe from "axe-core";
import puppeteer from "puppeteer-core";
import { applyExemptions, buildMatrix, renderSummary } from "./axe-report.mjs";

const here = import.meta.dirname;
const readJson = (file) => JSON.parse(readFileSync(path.join(here, file)));
const { port, paths } = readJson("targets.json");
const exemptions = readJson("axe-exemptions.json");
const reportDir = path.join(here, "reports/axe");

/** WCAG 2.0, 2.1 and 2.2 at levels A and AA, plus axe's best practices. */
const RULE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

// CHROME_PATH selects a binary (the same variable Lighthouse reads); otherwise the installed Chrome.
const browser = await puppeteer.launch(
	process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);

async function audit({ path: pagePath, scheme, viewport, label }) {
	const page = await browser.newPage();
	try {
		await page.setViewport({ width: viewport.width, height: viewport.height });
		// Reduced motion keeps axe from sampling colors in the middle of a transition.
		await page.emulateMediaFeatures([
			{ name: "prefers-color-scheme", value: scheme },
			{ name: "prefers-reduced-motion", value: "reduce" },
		]);
		await page.goto(`http://127.0.0.1:${port}${pagePath}`, { waitUntil: "load" });
		await page.evaluate(() => document.fonts.ready.then(() => undefined));
		await page.evaluate(axe.source);
		const { violations, incomplete } = await page.evaluate(
			(tags) => globalThis.axe.run(document, { runOnly: { type: "tag", values: tags } }),
			RULE_TAGS,
		);
		return { label, violations, incomplete };
	} finally {
		await page.close();
	}
}

const runs = [];
try {
	for (const entry of buildMatrix(paths)) runs.push(await audit(entry));
} finally {
	await browser.close();
}

const result = applyExemptions(runs, exemptions);
const { failed, markdown } = renderSummary(result);

mkdirSync(reportDir, { recursive: true });
writeFileSync(path.join(reportDir, "results.json"), JSON.stringify(result, null, "\t"));
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
process.exit(failed ? 1 : 0);
