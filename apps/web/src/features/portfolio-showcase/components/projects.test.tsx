import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Projects } from "./projects";

describe("Projects", () => {
	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	] as const)("renders the heading, lead and four cards (%s)", async (locale, dict) => {
		const { container } = render(
			<Projects
				locale={locale}
				projects={dict.projects}
				newTabLabel={dict.a11y.opensInNewTab}
			/>,
		);

		expect(screen.getByRole("heading", { level: 2, name: dict.projects.title })).toBeVisible();
		expect(screen.getByText(dict.projects.lead)).toBeInTheDocument();
		expect(screen.getAllByRole("article")).toHaveLength(4);
		expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
		expect(
			screen.getAllByRole("link", { name: new RegExp(dict.projects.liveDemo) }),
		).toHaveLength(1);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("exposes id=projects so the nav and hero CTA anchors resolve", () => {
		render(
			<Projects
				locale="en"
				projects={enDictionary.projects}
				newTabLabel={enDictionary.a11y.opensInNewTab}
			/>,
		);
		expect(screen.getByRole("region", { name: enDictionary.projects.title })).toHaveAttribute(
			"id",
			"projects",
		);
	});
});
