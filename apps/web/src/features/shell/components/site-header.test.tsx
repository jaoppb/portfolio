import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
	it("renders banner, wordmark link to top, labelled nav and language switcher", async () => {
		const { container } = render(<SiteHeader locale="en" dict={enDictionary} />);

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "João Pedro" })).toHaveAttribute("href", "#top");
		expect(screen.queryByRole("heading")).not.toBeInTheDocument();

		const nav = screen.getByRole("navigation", { name: "Main navigation" });
		const links = within(nav).getAllByRole("link");
		expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
			["About", "#about"],
			["Projects", "#projects"],
			["Experience", "#experience"],
			["Contact", "#contact"],
		]);

		const switcher = screen.getByRole("navigation", { name: "Language switcher" });
		expect(within(switcher).getByRole("link", { name: "en" })).toHaveAttribute(
			"aria-current",
			"page",
		);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("keeps DOM order wordmark, nav, language switcher", () => {
		render(<SiteHeader locale="en" dict={enDictionary} />);
		const names = screen.getAllByRole("link").map((l) => l.textContent);
		expect(names).toEqual([
			"João Pedro",
			"About",
			"Projects",
			"Experience",
			"Contact",
			"en",
			"pt",
		]);
	});

	it("renders Portuguese labels", () => {
		render(<SiteHeader locale="pt" dict={ptDictionary} />);
		const nav = screen.getByRole("navigation", { name: "Navegação principal" });
		expect(within(nav).getByRole("link", { name: "Experiência" })).toHaveAttribute(
			"href",
			"#experience",
		);
		expect(within(nav).getByRole("link", { name: "Contato" })).toBeInTheDocument();
	});

	it("prefixes hrefs with hrefBase for cross-page use", () => {
		render(<SiteHeader locale="en" dict={enDictionary} hrefBase="/en/" />);
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/en/#about");
		expect(screen.getByRole("link", { name: "João Pedro" })).toHaveAttribute(
			"href",
			"/en/#top",
		);
	});
});
