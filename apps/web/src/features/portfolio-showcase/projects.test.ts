import { describe, expect, it } from "vitest";
import { siteConfig } from "@/shared/config/site";
import { getProjects } from "./projects";

describe("project data", () => {
	it.each(siteConfig.locales)("has complete, unique projects (%s)", (locale) => {
		const projects = getProjects(locale);
		expect(projects.map((p) => p.slug)).toEqual(["alloy", "styx", "tools", "portfolio"]);
		expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);

		for (const project of projects) {
			expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
			expect(project.title.trim()).not.toBe("");
			expect(project.summary.trim()).not.toBe("");
			expect(project.year).toBe(2026);
			expect(project.tech.length).toBeGreaterThan(0);
			expect(project.tech.length).toBeLessThanOrEqual(3);
			expect(project.links.repository).toBe(`https://github.com/jaoppb/${project.slug}`);
		}
	});

	it("localizes the summaries per locale", () => {
		const en = getProjects("en");
		const pt = getProjects("pt");
		for (const [i, project] of en.entries()) {
			expect(pt[i]?.summary).not.toBe(project.summary);
		}
	});

	it("only the portfolio has a live demo, pointing at the localized site", () => {
		for (const locale of siteConfig.locales) {
			const withDemo = getProjects(locale).filter((p) => p.links.demo !== undefined);
			expect(withDemo.map((p) => p.slug)).toEqual(["portfolio"]);
			expect(withDemo[0]?.links.demo).toBe(`https://jaoppb.com/${locale}`);
		}
	});
});
