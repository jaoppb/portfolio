import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher component", () => {
	it("renders navigation with links for each configured locale", () => {
		render(<LanguageSwitcher currentLocale="en" ariaLabel="Language switcher navigation" />);

		const nav = screen.getByRole("navigation", {
			name: "Language switcher navigation",
		});
		expect(nav).toBeInTheDocument();

		const enLink = screen.getByRole("link", { name: "en" });
		const ptLink = screen.getByRole("link", { name: "pt" });

		expect(enLink).toHaveAttribute("href", "/en");
		expect(enLink).toHaveAttribute("hrefLang", "en");
		expect(enLink).toHaveAttribute("aria-current", "page");

		expect(ptLink).toHaveAttribute("href", "/pt");
		expect(ptLink).toHaveAttribute("hrefLang", "pt");
		expect(ptLink).not.toHaveAttribute("aria-current");
	});

	it("marks Portuguese as active when currentLocale is pt", () => {
		render(<LanguageSwitcher currentLocale="pt" ariaLabel="Alternador de idioma" />);

		const enLink = screen.getByRole("link", { name: "en" });
		const ptLink = screen.getByRole("link", { name: "pt" });

		expect(enLink).not.toHaveAttribute("aria-current");
		expect(ptLink).toHaveAttribute("aria-current", "page");
	});

	it("passes automated accessibility checks with zero violations", async () => {
		const { container } = render(
			<header>
				<LanguageSwitcher currentLocale="en" ariaLabel="Language switcher navigation" />
			</header>,
		);

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
