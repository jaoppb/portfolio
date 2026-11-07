import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Hero } from "./hero";

describe("Hero", () => {
	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	])("renders one h1, the role eyebrow, intro and CTAs (%s)", async (_l, dict) => {
		const { container } = render(<Hero hero={dict.hero} />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		expect(screen.getByRole("heading", { level: 1, name: dict.hero.headline })).toBeVisible();
		expect(screen.getByText(dict.hero.role)).toBeInTheDocument();
		expect(screen.getByText(dict.hero.intro)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: dict.hero.ctaProjects })).toHaveAttribute(
			"href",
			"#projects",
		);
		expect(screen.getByRole("link", { name: dict.hero.ctaContact })).toHaveAttribute(
			"href",
			"#contact",
		);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("exposes the hero section id and labels it by the h1", () => {
		render(<Hero hero={enDictionary.hero} />);
		const region = screen.getByRole("region", { name: enDictionary.hero.headline });
		expect(region).toHaveAttribute("id", "hero");
	});
});
