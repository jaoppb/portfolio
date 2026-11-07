// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workflows = path.resolve(import.meta.dirname, "../../../../../.github/workflows");

/** Returns the `env:` entries of the step that builds the site (`uses: build-site`). */
function buildSiteEnv(file: string): Record<string, string> {
	const lines = readFileSync(path.join(workflows, file), "utf8").split("\n");
	const uses = lines.findIndex((line) => line.includes("uses: ./.github/actions/build-site"));
	expect(uses, `${file} has no build-site step`).toBeGreaterThan(-1);

	const env: Record<string, string> = {};
	let inEnv = false;
	for (const line of lines.slice(uses + 1)) {
		if (/^\s*- name:/.test(line)) break;
		if (/^\s*env:\s*$/.test(line)) inEnv = true;
		else if (inEnv) {
			const match = line.match(/^\s+([A-Z_]+):\s*"?([^"#]*?)"?\s*(#.*)?$/);
			if (match) env[match[1]] = match[2];
		}
	}
	return env;
}

describe("deploy workflows build env", () => {
	it("production builds with its URL and stays noindex until launch (#47)", () => {
		expect(buildSiteEnv("deploy-production.yml")).toMatchObject({
			NEXT_PUBLIC_SITE_URL: "https://jaoppb.com",
			NEXT_PUBLIC_ROBOTS_NOINDEX: "1",
		});
	});

	it("preview builds with a placeholder URL and noindex", () => {
		expect(buildSiteEnv("deploy-preview.yml")).toMatchObject({
			NEXT_PUBLIC_SITE_URL: "https://example.com",
			NEXT_PUBLIC_ROBOTS_NOINDEX: "1",
		});
	});

	it("CI build sets a site URL", () => {
		const ci = readFileSync(path.join(workflows, "ci.yml"), "utf8");
		expect(ci).toMatch(/NEXT_PUBLIC_SITE_URL: https:\/\/example\.com/);
	});
});
