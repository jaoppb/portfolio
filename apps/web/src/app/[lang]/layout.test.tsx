import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import LocalizedLayout, { generateStaticParams } from "./layout";

describe("LocalizedLayout", () => {
	it("returns static params for all supported locales", async () => {
		const params = await generateStaticParams();
		expect(params).toEqual([{ lang: "en" }, { lang: "pt" }]);
	});

	it("renders header, navigation, main skip link, main container, and footer landmarks", async () => {
		const Layout = await LocalizedLayout({
			params: Promise.resolve({ lang: "en" }),
			children: <div data-testid="child-content">Child content</div>,
		});

		const { container } = render(Layout);

		const skipLink = screen.getByRole("link", {
			name: /skip to main content/i,
		});
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute("href", "#main-content");

		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: /language switcher/i })).toBeInTheDocument();

		const main = screen.getByRole("main");
		expect(main).toBeInTheDocument();
		expect(main).toHaveAttribute("id", "main-content");
		expect(main).toHaveAttribute("tabindex", "-1");

		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		expect(screen.getByTestId("child-content")).toBeInTheDocument();

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it("renders localized labels in Portuguese", async () => {
		const Layout = await LocalizedLayout({
			params: Promise.resolve({ lang: "pt" }),
			children: <div>Conteúdo</div>,
		});

		render(Layout);

		expect(
			screen.getByRole("link", { name: /pular para o conteúdo principal/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("navigation", { name: /navegação principal/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("navigation", { name: /alternador de idioma/i }),
		).toBeInTheDocument();
	});
});
