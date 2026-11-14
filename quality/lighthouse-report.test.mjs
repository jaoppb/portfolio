import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderLighthouseSummary } from "./lighthouse-report.mjs";

const medianRun = (pagePath, performance) => ({
	url: `http://127.0.0.1:8788${pagePath}`,
	isRepresentativeRun: true,
	summary: { performance, accessibility: 1, "best-practices": 1, seo: 1 },
});
const expected = { urls: ["http://127.0.0.1:8788/pt"], runs: 1 };
const render = (input) => renderLighthouseSummary({ expected, ...input }).markdown;
const failure = (overrides) => ({
	url: "http://127.0.0.1:8788/pt",
	auditId: "resource-summary",
	auditProperty: "script.size",
	operator: "<=",
	expected: 157000,
	actual: 170123,
	passed: false,
	...overrides,
});

describe("renderLighthouseSummary", () => {
	it("reports a pass with the scores of the median run of each page", () => {
		const { markdown, complete } = renderLighthouseSummary({
			manifest: [
				medianRun("/en", 0.99),
				{ ...medianRun("/en", 0.5), isRepresentativeRun: false },
				medianRun("/pt", 1),
				{ ...medianRun("/pt", 1), isRepresentativeRun: false },
			],
			assertions: [],
			expected: { urls: ["http://127.0.0.1:8788/en", "http://127.0.0.1:8788/pt"], runs: 2 },
		});

		assert.equal(complete, true);

		assert.match(markdown, /Lighthouse: passed/);
		assert.match(markdown, /\| \/en \| 99 \| 100 \| 100 \| 100 \|/);
		assert.match(markdown, /\| \/pt \| 100 \| 100 \| 100 \| 100 \|/);
		assert.doesNotMatch(markdown, /\| 50 \|/);
	});

	it("lists every failed budget with page, audit, expectation and value", () => {
		const markdown = render({
			manifest: [medianRun("/pt", 1)],
			assertions: [failure({}), { ...failure({ auditId: "canonical" }), passed: true }],
		});

		assert.match(markdown, /Lighthouse: FAILED/);
		assert.match(
			markdown,
			/\| \/pt \| resource-summary:script\.size \| <= 157000 \| 170123 \|/,
		);
		assert.doesNotMatch(markdown, /canonical/);
	});

	it("survives a failure without a numeric value and shows its message", () => {
		const markdown = render({
			manifest: [medianRun("/pt", 1)],
			assertions: [
				failure({
					auditId: "hreflang",
					auditProperty: undefined,
					actual: null,
					message: "Audit did not produce a value",
				}),
			],
		});

		assert.match(
			markdown,
			/\| \/pt \| hreflang \| <= 157000 \| no value \(Audit did not produce a value\) \|/,
		);
	});

	it("rounds long decimals", () => {
		const markdown = render({
			manifest: [medianRun("/pt", 1)],
			assertions: [failure({ actual: 6970.2506 })],
		});

		assert.match(markdown, /\| 6970\.251 \|/);
	});

	it("does not claim a pass when Lighthouse produced no assertion results", () => {
		const { markdown, complete } = renderLighthouseSummary({
			manifest: null,
			assertions: null,
			expected,
		});

		assert.equal(complete, false);
		assert.match(markdown, /Lighthouse: DID NOT RUN/);
		assert.doesNotMatch(markdown, /passed/);
	});

	it("is incomplete when a page has fewer runs than expected, even with no failed budget", () => {
		const { markdown, complete } = renderLighthouseSummary({
			manifest: [medianRun("/en", 1)],
			assertions: [],
			expected: { urls: ["http://127.0.0.1:8788/en", "http://127.0.0.1:8788/pt"], runs: 1 },
		});

		assert.equal(complete, false);
		assert.match(markdown, /Lighthouse: INCOMPLETE/);
		assert.match(markdown, /\/pt: 0 of 1 runs/);
		assert.doesNotMatch(markdown, /passed/);
	});
});
