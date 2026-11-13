/** Pure rendering of the Lighthouse CI output as Markdown. */

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const pagePath = (url) => new URL(url).pathname;
const percent = (score) => Math.round(score * 100);

/** lhci stores a missing value as null (NaN through JSON). */
function actualValue({ actual, message }) {
	if (typeof actual !== "number") return message ? `no value (${message})` : "no value";
	return Number.isInteger(actual) ? actual : Number(actual.toFixed(3));
}

const failureRow = (failure) =>
	`| ${pagePath(failure.url)} | ${[failure.auditId, failure.auditProperty].filter(Boolean).join(":")} | ${failure.operator} ${failure.expected} | ${actualValue(failure)} |`;

/** Pages that were audited fewer times than configured: lhci only checks the reports it has. */
const missingRuns = (manifest, { urls, runs }) =>
	urls
		.map((url) => ({ url, found: manifest.filter((run) => run.url === url).length }))
		.filter(({ found }) => found < runs)
		.map(({ url, found }) => `- ${pagePath(url)}: ${found} of ${runs} runs`);

/**
 * `manifest` is the manifest.json of the filesystem upload and `assertions` the
 * assertion-results.json of `lhci assert`. Either is null when lhci stopped before writing it.
 * `complete` is false when Lighthouse did not audit every expected page the expected number
 * of times, which must fail the gate whatever the budgets say.
 */
export function renderLighthouseSummary({ manifest, assertions, expected }) {
	if (assertions === null) {
		return {
			complete: false,
			markdown:
				"### Lighthouse: DID NOT RUN\n\nLighthouse CI stopped before checking the budgets. See the job log.\n",
		};
	}
	const runs = manifest ?? [];
	const missing = missingRuns(runs, expected);
	const medianRuns = runs.filter((run) => run.isRepresentativeRun);
	const failures = assertions.filter((result) => !result.passed);
	const verdict = missing.length > 0 ? "INCOMPLETE" : failures.length > 0 ? "FAILED" : "passed";
	const lines = [
		`### Lighthouse: ${verdict}`,
		"",
		"Scores of the median run of each page (mobile emulation). Each budget is checked on its own value across the runs, so a failed budget below can differ slightly from this table. Full reports are in the `quality-reports` artifact.",
		"",
		`| Page | ${CATEGORIES.join(" | ")} |`,
		`| :--- | ${CATEGORIES.map(() => "---:").join(" | ")} |`,
		...medianRuns.map(
			(run) =>
				`| ${pagePath(run.url)} | ${CATEGORIES.map((id) => percent(run.summary[id])).join(" | ")} |`,
		),
	];
	if (failures.length > 0) {
		lines.push(
			"",
			"#### Failed budgets",
			"",
			"| Page | Audit | Expected | Actual |",
			"| :--- | :--- | :--- | ---: |",
			...failures.map(failureRow),
		);
	}
	if (missing.length > 0) {
		lines.push("", "#### Missing reports", "", ...missing);
	}
	return { complete: missing.length === 0, markdown: `${lines.join("\n")}\n` };
}
