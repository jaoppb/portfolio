/**
 * Lighthouse CI: what is collected and the budgets that fail the gate.
 * Every number here is explained in docs/workflows/quality-gate.md. Change both together.
 */
const path = require("node:path");
const { port, paths } = require("./targets.json");

/** Must hold on every run: these results do not depend on the speed of the machine. */
const always = (options) => ["error", { ...options, aggregationMethod: "pessimistic" }];
/** Timing results vary between runs: judged on the median of the runs. */
const onMedian = (options) => ["error", { ...options, aggregationMethod: "median" }];

const maxBytes = (bytes) => always({ maxNumericValue: bytes });

/** Asserted one by one so a failure names the audit, and so a reweighted category cannot hide one. */
const SEO_AUDITS = [
	"is-crawlable",
	"canonical",
	"hreflang",
	"meta-description",
	"document-title",
	"robots-txt",
	"http-status-code",
];

module.exports = {
	ci: {
		collect: {
			url: paths.map((pagePath) => `http://127.0.0.1:${port}${pagePath}`),
			numberOfRuns: 3,
			settings: {
				// Default mobile emulation. Other categories are not gated, so they are not run.
				onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
			},
		},
		assert: {
			assertions: {
				"categories:accessibility": always({ minScore: 1 }),
				"categories:best-practices": always({ minScore: 1 }),
				"categories:seo": always({ minScore: 1 }),
				...Object.fromEntries(SEO_AUDITS.map((audit) => [audit, always({ minScore: 1 })])),

				"resource-summary:script:size": maxBytes(157_000),
				"resource-summary:font:size": maxBytes(95_000),
				"resource-summary:stylesheet:size": maxBytes(8_000),
				"resource-summary:document:size": maxBytes(14_000),
				"resource-summary:total:size": maxBytes(297_000),
				"resource-summary:total:count": always({ maxNumericValue: 22 }),
				"resource-summary:third-party:count": always({ maxNumericValue: 0 }),
				"cumulative-layout-shift": always({ maxNumericValue: 0.01 }),

				"categories:performance": onMedian({ minScore: 0.5 }),
				"largest-contentful-paint": onMedian({ maxNumericValue: 4000 }),
				"total-blocking-time": onMedian({ maxNumericValue: 5000 }),
			},
		},
		upload: {
			target: "filesystem",
			outputDir: path.join(__dirname, "reports/lighthouse"),
		},
	},
};
