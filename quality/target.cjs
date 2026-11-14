/**
 * What the audits run against: the local server of with-server.mjs (the CI gate), or the live
 * production site when QUALITY_TARGET=production (docs/workflows/launch.md). The live audit
 * also needs QUALITY_EXPECT: "noindex" before the launch switch is flipped, "indexable" after.
 */
const { port, paths, defaultPath, production } = require("./targets.json");

const STATES = ["noindex", "indexable"];
const target = process.env.QUALITY_TARGET ?? "local";
if (target !== "local" && target !== "production") {
	throw new Error(`QUALITY_TARGET must be "local" or "production", got "${target}".`);
}
const live = target === "production";
const expected = live ? process.env.QUALITY_EXPECT : "indexable";
if (!STATES.includes(expected)) {
	throw new Error(
		`QUALITY_EXPECT must be one of ${STATES.join(", ")} with QUALITY_TARGET=production.`,
	);
}

const baseUrl = live ? production.site : `http://127.0.0.1:${port}`;

module.exports = {
	live,
	indexable: expected === "indexable",
	production,
	paths,
	defaultPath,
	urlOf: (pagePath) => `${baseUrl}${pagePath}`,
};
