/**
 * Lighthouse CI: what is collected and the budgets that fail the gate.
 * Every number here is explained in docs/workflows/quality-gate.md. Change both together.
 */
const path = require("node:path");
const { live, indexable, paths, urlOf } = require("./target.cjs");

/** Must hold on every run: these results do not depend on the speed of the machine. */
const always = (options) => ["error", { ...options, aggregationMethod: "pessimistic" }];
/** Timing results vary between runs: judged on the median of the runs. */
const onMedian = (options) => ["error", { ...options, aggregationMethod: "median" }];

const maxBytes = (bytes) => always({ maxNumericValue: bytes });

/**
 * Asserted one by one so a failure names the audit, and so a reweighted category cannot hide one.
 * Lighthouse validates what the page has: a missing canonical or robots.txt is "not applicable"
 * and passes. That they exist is asserted by apps/web/src/app/seo-export.test.ts.
 */
const SEO_AUDITS = [
	"is-crawlable",
	"canonical",
	"hreflang",
	"meta-description",
	"document-title",
	"robots-txt",
	"http-status-code",
];

const seoAssertions = {
	"categories:seo": always({ minScore: 1 }),
	...Object.fromEntries(SEO_AUDITS.map((audit) => [audit, always({ minScore: 1 })])),
};

/** Held on the local server and on the live site alike. */
const sharedAssertions = {
	"categories:accessibility": always({ minScore: 1 }),
	"categories:best-practices": always({ minScore: 1 }),
	"categories:performance": onMedian({ minScore: 0.9 }),
	"resource-summary:third-party:count": always({ maxNumericValue: 0 }),
	"cumulative-layout-shift": always({ maxNumericValue: 0.01 }),
};

/** The CI gate, on the local server. */
const gateAssertions = {
	...sharedAssertions,
	...seoAssertions,

	"resource-summary:script:size": maxBytes(157_000),
	"resource-summary:font:size": maxBytes(95_000),
	"resource-summary:stylesheet:size": maxBytes(8_000),
	"resource-summary:document:size": maxBytes(14_000),
	"resource-summary:total:size": maxBytes(297_000),
	"resource-summary:total:count": always({ maxNumericValue: 22 }),

	"largest-contentful-paint": onMedian({ maxNumericValue: 2000 }),
	"total-blocking-time": onMedian({ maxNumericValue: 300 }),
};

/**
 * The launch audit, on the live site (docs/workflows/launch.md). Byte sizes and timings depend
 * on the real edge and network, so they are recorded in the reports and only the performance
 * score is held to a floor. A noindex site fails the SEO audits by design.
 */
const liveAssertions = { ...sharedAssertions, ...(indexable ? seoAssertions : {}) };

module.exports = {
	ci: {
		collect: {
			url: paths.map(urlOf),
			numberOfRuns: 3,
			settings: {
				// Default mobile emulation. Other categories are not gated, so they are not run.
				onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
			},
		},
		assert: { assertions: live ? liveAssertions : gateAssertions },
		upload: {
			target: "filesystem",
			outputDir: path.join(__dirname, "reports/lighthouse"),
		},
	},
};
