import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { SiteShell } from "./site-shell";

describe("SiteShell", () => {
	it("renders skip link, header, main container and footer around its children", async () => {
		const { container } = render(
			<SiteShell locale="en" dict={enDictionary}>
				<div data-testid="child-content">Child content</div>
			</SiteShell>,
		);

		expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute(
			"href",
			"#main-content",
		);
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: /language switcher/i })).toBeInTheDocument();

		const main = screen.getByRole("main");
		expect(main).toHaveAttribute("id", "main-content");
		expect(main).toHaveAttribute("tabindex", "-1");
		expect(within(main).getByTestId("child-content")).toBeInTheDocument();

		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		expect(container.querySelector("#top")).not.toBeNull();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("uses same-page anchors on the home page", () => {
		render(
			<SiteShell locale="en" dict={enDictionary} homePage>
				<p>Home</p>
			</SiteShell>,
		);
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
	});

	it("renders localized labels and links to the locale home page elsewhere", () => {
		render(
			<SiteShell locale="pt" dict={ptDictionary}>
				<p>Conteúdo</p>
			</SiteShell>,
		);

		expect(
			screen.getByRole("link", { name: /pular para o conteúdo principal/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "/pt#about");
		expect(screen.getByRole("link", { name: /^Voltar ao topo/ })).toHaveAttribute(
			"href",
			"#top",
		);
	});
});
