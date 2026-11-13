import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyExemptions, buildMatrix, renderSummary } from "./axe-report.mjs";

const node = (selector) => ({ target: [selector], failureSummary: `Fix ${selector}` });
const violation = (id, selectors) => ({
	id,
	impact: "serious",
	help: `${id} help`,
	helpUrl: `https://example.test/${id}`,
	nodes: selectors.map(node),
});
const run = (label, violations) => ({ label, violations, incomplete: [] });

describe("buildMatrix", () => {
	it("crosses every path with both color schemes and both viewports", () => {
		const matrix = buildMatrix(["/en", "/pt"]);

		assert.equal(matrix.length, 8);
		assert.deepEqual(matrix[0], {
			path: "/en",
			scheme: "light",
			viewport: { name: "mobile", width: 390, height: 844 },
			label: "/en light mobile",
		});
		assert.equal(new Set(matrix.map((entry) => entry.label)).size, 8);
	});
});

describe("applyExemptions", () => {
	const exemption = { rule: "color-contrast", selector: ".tag", issue: 99, reason: "tracked" };

	it("removes only the exempted selector of the exempted rule", () => {
		const runs = [
			run("/en light mobile", [
				violation("color-contrast", [".tag", ".other"]),
				violation("link-name", [".tag"]),
			]),
		];

		const { runs: filtered, unused } = applyExemptions(runs, [exemption]);

		assert.deepEqual(
			filtered[0].violations.map((v) => [v.id, v.nodes.map((n) => n.target[0])]),
			[
				["color-contrast", [".other"]],
				["link-name", [".tag"]],
			],
		);
		assert.deepEqual(unused, []);
	});

	it("drops a violation whose nodes are all exempted", () => {
		const runs = [run("/en light mobile", [violation("color-contrast", [".tag"])])];

		const { runs: filtered } = applyExemptions(runs, [exemption]);

		assert.deepEqual(filtered[0].violations, []);
	});

	it("reports exemptions that matched nothing so they cannot go stale", () => {
		const runs = [run("/en light mobile", [violation("link-name", [".tag"])])];

		const { unused } = applyExemptions(runs, [exemption]);

		assert.deepEqual(unused, [exemption]);
	});
});

describe("renderSummary", () => {
	it("reports a pass with one row per run", () => {
		const summary = renderSummary({
			runs: [run("/en light mobile", []), run("/pt dark desktop", [])],
			unused: [],
		});

		assert.equal(summary.failed, false);
		assert.match(summary.markdown, /axe: passed/);
		assert.match(summary.markdown, /\| \/en light mobile \| 0 \| 0 \|/);
		assert.match(summary.markdown, /\| \/pt dark desktop \| 0 \| 0 \|/);
	});

	it("fails and lists rule, selector and help link for each violation", () => {
		const summary = renderSummary({
			runs: [run("/pt dark desktop", [violation("color-contrast", [".tag"])])],
			unused: [],
		});

		assert.equal(summary.failed, true);
		assert.match(summary.markdown, /axe: FAILED/);
		assert.match(summary.markdown, /\| \/pt dark desktop \| 1 \| 0 \|/);
		assert.match(summary.markdown, /color-contrast/);
		assert.match(summary.markdown, /`\.tag`/);
		assert.match(summary.markdown, /https:\/\/example\.test\/color-contrast/);
	});

	it("fails on a stale exemption even without violations", () => {
		const summary = renderSummary({
			runs: [run("/en light mobile", [])],
			unused: [{ rule: "color-contrast", selector: ".tag", issue: 99, reason: "tracked" }],
		});

		assert.equal(summary.failed, true);
		assert.match(summary.markdown, /Stale exemptions/);
		assert.match(summary.markdown, /color-contrast.*`\.tag`.*#99/);
	});
});
