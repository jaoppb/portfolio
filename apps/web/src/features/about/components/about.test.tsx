import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { About } from "./about";

describe("About", () => {
	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	])("renders the h2 and both paragraphs (%s)", async (_l, dict) => {
		const { container } = render(<About about={dict.about} />);

		expect(screen.getByRole("heading", { level: 2, name: dict.about.title })).toBeVisible();
		expect(screen.getByText(dict.about.p1)).toBeInTheDocument();
		expect(screen.getByText(dict.about.p2)).toBeInTheDocument();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("exposes id=about so the nav anchor resolves", () => {
		render(<About about={enDictionary.about} />);
		expect(screen.getByRole("region", { name: enDictionary.about.title })).toHaveAttribute(
			"id",
			"about",
		);
	});
});
