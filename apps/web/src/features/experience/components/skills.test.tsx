import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Skills } from "./skills";

describe("Skills", () => {
	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	] as const)("renders each group as a headed plain list (%s)", async (_l, dict) => {
		const { container } = render(<Skills skills={dict.skills} />);

		expect(screen.getByRole("heading", { level: 2, name: dict.skills.title })).toBeVisible();
		const groups = screen.getAllByRole("heading", { level: 3 });
		expect(groups.map((h) => h.textContent)).toEqual(dict.skills.groups.map((g) => g.label));
		for (const group of dict.skills.groups) {
			const list = screen.getByRole("list", { name: group.label });
			expect(
				within(list)
					.getAllByRole("listitem")
					.map((i) => i.textContent),
			).toEqual(group.items);
		}
		expect(await axe(container)).toHaveNoViolations();
	});

	it("exposes id=skills", () => {
		render(<Skills skills={enDictionary.skills} />);
		expect(screen.getByRole("region", { name: enDictionary.skills.title })).toHaveAttribute(
			"id",
			"skills",
		);
	});
});
