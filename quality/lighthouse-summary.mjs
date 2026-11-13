#!/usr/bin/env node
/**
 * Prints the Lighthouse CI result as Markdown (scores of the median run of each page and
 * every failed budget) and appends it to the job summary on GitHub Actions.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderLighthouseSummary } from "./lighthouse-report.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file)) : null);

const markdown = renderLighthouseSummary({
	manifest: readJson(path.join(import.meta.dirname, "reports/lighthouse/manifest.json")),
	assertions: readJson(path.join(root, ".lighthouseci/assertion-results.json")),
});
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
