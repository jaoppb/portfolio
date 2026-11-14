import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Experience } from "./experience";

describe("Experience", () => {
	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	] as const)("renders the entries in dictionary order (%s)", async (locale, dict) => {
		const { container } = render(<Experience locale={locale} experience={dict.experience} />);

		expect(
			screen.getByRole("heading", { level: 2, name: dict.experience.title }),
		).toBeVisible();
		const entries = within(screen.getByRole("list", { name: dict.experience.title }))
			.getAllByRole("heading", { level: 3 })
			.map((h) => h.textContent);
		expect(entries).toEqual(dict.experience.entries.map((e) => e.role));
		for (const { highlights } of dict.experience.entries) {
			for (const text of highlights) expect(screen.getByText(text)).toBeInTheDocument();
		}
		expect(await axe(container)).toHaveNoViolations();
	});

	it("marks dates up with <time> and ISO values; the open-ended role has one", () => {
		const { container } = render(
			<Experience locale="en" experience={enDictionary.experience} />,
		);
		const times = Array.from(container.querySelectorAll("time"));
		expect(times.map((t) => t.getAttribute("datetime"))).toEqual([
			"2026-07",
			"2025-10",
			"2026-07",
		]);
		expect(times.map((t) => t.textContent)).toEqual(["Jul 2026", "Oct 2025", "Jul 2026"]);
		expect(screen.getByText(enDictionary.experience.present)).toBeInTheDocument();
	});

	it("uses tabular figures for dates", () => {
		const { container } = render(
			<Experience locale="en" experience={enDictionary.experience} />,
		);
		expect(container.querySelector("time")?.parentElement).toHaveClass("tabular-nums");
	});

	it.each([
		["en", enDictionary],
		["pt", ptDictionary],
	] as const)("keeps each date range on one line in the row layout (%s)", (locale, dict) => {
		const { container } = render(<Experience locale={locale} experience={dict.experience} />);
		const ranges = container.querySelectorAll("p:has(> time)");
		expect(ranges).toHaveLength(dict.experience.entries.length);
		for (const range of ranges) {
			expect(range).toHaveClass("md:w-60", "md:shrink-0", "md:whitespace-nowrap");
			// The column is 240px and a 14px mono character is 8.4px wide: 28 characters fit.
			expect(range.textContent?.length).toBeLessThanOrEqual(28);
		}
	});

	it("exposes id=experience so the nav anchor resolves", () => {
		render(<Experience locale="en" experience={enDictionary.experience} />);
		expect(screen.getByRole("region", { name: enDictionary.experience.title })).toHaveAttribute(
			"id",
			"experience",
		);
	});
});
