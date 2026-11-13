#!/usr/bin/env node
/**
 * Turns the Lighthouse CI output into Markdown: the scores of the median run of each page
 * and every failed budget. Printed, and appended to the job summary on GitHub Actions.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestFile = path.join(import.meta.dirname, "reports/lighthouse/manifest.json");
const assertionsFile = path.join(root, ".lighthouseci/assertion-results.json");
const readJson = (file) => (existsSync(file) ? JSON.parse(readFileSync(file)) : []);

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const pagePath = (url) => new URL(url).pathname;
const percent = (score) => Math.round(score * 100);
const round = (value) => (Number.isInteger(value) ? value : Number(value.toFixed(3)));

const medianRuns = readJson(manifestFile).filter((run) => run.isRepresentativeRun);
const failures = readJson(assertionsFile).filter((result) => !result.passed);

const lines = [
	`### Lighthouse: ${failures.length > 0 ? "FAILED" : "passed"}`,
	"",
	"Scores of the median run (mobile emulation). Full reports are in the `quality-reports` artifact.",
	"",
	`| Page | ${CATEGORIES.join(" | ")} |`,
	`| :--- | ${CATEGORIES.map(() => "---:").join(" | ")} |`,
	...medianRuns.map(
		(run) =>
			`| ${pagePath(run.url)} | ${CATEGORIES.map((id) => percent(run.summary[id])).join(" | ")} |`,
	),
];
if (medianRuns.length === 0) lines.push("", "No Lighthouse report was produced. See the job log.");
if (failures.length > 0) {
	lines.push(
		"",
		"#### Failed budgets",
		"",
		"| Page | Audit | Expected | Actual |",
		"| :--- | :--- | :--- | ---: |",
		...failures.map(
			(failure) =>
				`| ${pagePath(failure.url)} | ${[failure.auditId, failure.auditProperty].filter(Boolean).join(":")} | ${failure.operator} ${failure.expected} | ${round(failure.actual)} |`,
		),
	);
}

const markdown = `${lines.join("\n")}\n`;
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
