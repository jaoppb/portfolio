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

/**
 * `manifest` is the manifest.json of the filesystem upload and `assertions` the
 * assertion-results.json of `lhci assert`. Either is null when lhci stopped before writing it.
 */
export function renderLighthouseSummary({ manifest, assertions }) {
	if (assertions === null) {
		return "### Lighthouse: DID NOT RUN\n\nLighthouse CI stopped before checking the budgets. See the job log.\n";
	}
	const medianRuns = (manifest ?? []).filter((run) => run.isRepresentativeRun);
	const failures = assertions.filter((result) => !result.passed);
	const lines = [
		`### Lighthouse: ${failures.length > 0 ? "FAILED" : "passed"}`,
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
	return `${lines.join("\n")}\n`;
}
