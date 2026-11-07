import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { Project } from "../projects";
import { ProjectCard } from "./project-card";

const labels = {
	repository: "Repository",
	liveDemo: "Live demo",
	newTab: "(opens in a new tab)",
};

const project: Project = {
	slug: "alloy",
	title: "Alloy",
	summary: "A modular web browser.",
	year: 2026,
	tech: ["Rust", "Rhai"],
	links: { repository: "https://github.com/jaoppb/alloy" },
};

describe("ProjectCard", () => {
	it("renders year, an h3 title, summary and the tech line", async () => {
		const { container } = render(
			<ul>
				<ProjectCard project={project} labels={labels} />
			</ul>,
		);

		expect(screen.getByRole("heading", { level: 3, name: "Alloy" })).toBeVisible();
		expect(screen.getByText("A modular web browser.")).toBeInTheDocument();
		expect(screen.getByText("2026")).toBeInTheDocument();
		expect(screen.getByText("Rust · Rhai")).toBeInTheDocument();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("names the repository link with the project and opens a new tab safely", () => {
		render(
			<ul>
				<ProjectCard project={project} labels={labels} />
			</ul>,
		);

		const link = screen.getByRole("link", { name: /^Repository.*Alloy.*opens in a new tab/ });
		expect(link).toHaveAttribute("href", "https://github.com/jaoppb/alloy");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(link).not.toHaveAttribute("aria-label");
	});

	it("omits the live demo link when the project has none", () => {
		render(
			<ul>
				<ProjectCard project={project} labels={labels} />
			</ul>,
		);
		expect(screen.getAllByRole("link")).toHaveLength(1);
		expect(screen.queryByText("Live demo")).not.toBeInTheDocument();
	});

	it("renders the live demo link when present", () => {
		render(
			<ul>
				<ProjectCard
					project={{
						...project,
						links: { ...project.links, demo: "https://jaoppb.com/en" },
					}}
					labels={labels}
				/>
			</ul>,
		);
		const card = screen.getByRole("article");
		const demo = within(card).getByRole("link", { name: /^Live demo.*Alloy/ });
		expect(demo).toHaveAttribute("href", "https://jaoppb.com/en");
		expect(demo).toHaveAttribute("rel", "noopener noreferrer");
	});
});
