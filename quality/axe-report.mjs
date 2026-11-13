/** Pure helpers of the axe gate: the audit matrix, exemptions and the report. */

const SCHEMES = ["light", "dark"];
const VIEWPORTS = [
	{ name: "mobile", width: 390, height: 844 },
	{ name: "desktop", width: 1280, height: 800 },
];

/** Every path in both color schemes and at both viewports. */
export function buildMatrix(paths) {
	return paths.flatMap((path) =>
		SCHEMES.flatMap((scheme) =>
			VIEWPORTS.map((viewport) => ({
				path,
				scheme,
				viewport,
				label: `${path} ${scheme} ${viewport.name}`,
			})),
		),
	);
}

/** The selector of a node as the report prints it (frames and shadow roots joined by spaces). */
const selectorOf = (node) => node.target.flat().join(" ");

const matches = (exemption, violation, node) =>
	exemption.rule === violation.id && selectorOf(node) === exemption.selector;

/**
 * Removes the nodes covered by an exemption (one rule on one selector, in every run) and returns the
 * exemptions that matched nothing, so a fixed problem cannot leave a dead exemption behind.
 */
export function applyExemptions(runs, exemptions) {
	const used = new Set();
	const filtered = runs.map((run) => ({
		...run,
		violations: run.violations
			.map((violation) => ({
				...violation,
				nodes: violation.nodes.filter((node) => {
					const exemption = exemptions.find((entry) => matches(entry, violation, node));
					if (exemption) used.add(exemption);
					return !exemption;
				}),
			}))
			.filter((violation) => violation.nodes.length > 0),
	}));
	return { runs: filtered, unused: exemptions.filter((entry) => !used.has(entry)) };
}

const violationLines = (run) =>
	run.violations.flatMap((violation) => [
		`- **${violation.id}** (${violation.impact}) in \`${run.label}\`: [${violation.help}](${violation.helpUrl})`,
		...violation.nodes.map(
			(node) => `  - \`${selectorOf(node)}\`: ${node.failureSummary.replaceAll("\n", " ")}`,
		),
	]);

/** Markdown for the job summary and the terminal, plus the verdict of the gate. */
export function renderSummary({ runs, unused }) {
	const violating = runs.filter((run) => run.violations.length > 0);
	const failed = violating.length > 0 || unused.length > 0;
	const lines = [
		`### axe: ${failed ? "FAILED" : "passed"}`,
		"",
		"| Run | Violations | Needs manual review |",
		"| :--- | ---: | ---: |",
		...runs.map(
			(run) => `| ${run.label} | ${run.violations.length} | ${run.incomplete.length} |`,
		),
	];
	if (violating.length > 0) {
		lines.push("", "#### Violations", "", ...violating.flatMap(violationLines));
	}
	if (unused.length > 0) {
		lines.push(
			"",
			"#### Stale exemptions",
			"",
			"These exemptions matched nothing. Remove them from `quality/axe-exemptions.json`.",
			"",
			...unused.map((entry) => `- ${entry.rule} on \`${entry.selector}\` (#${entry.issue})`),
		);
	}
	return { failed, markdown: `${lines.join("\n")}\n` };
}
