import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { siteConfig } from "@/shared/config/site";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
	it("renders contentinfo with copyright, external source link and back to top", async () => {
		const { container } = render(<SiteFooter dict={enDictionary} />);

		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		expect(screen.getByText("© 2026 João Pedro")).toBeInTheDocument();

		const source = screen.getByRole("link", { name: /^Source code/ });
		expect(source).toHaveAttribute("href", siteConfig.repositoryUrl);
		expect(source).toHaveAttribute("target", "_blank");
		expect(source).toHaveAttribute("rel", "noopener noreferrer");
		expect(source).toHaveAccessibleName("Source code (opens in a new tab)");

		expect(screen.getByRole("link", { name: /^Back to top/ })).toHaveAttribute("href", "#top");
		expect(await axe(container)).toHaveNoViolations();
	});

	it("renders Portuguese labels and honours hrefBase", () => {
		render(<SiteFooter dict={ptDictionary} hrefBase="/pt/" />);
		expect(screen.getByRole("link", { name: /^Voltar ao topo/ })).toHaveAttribute(
			"href",
			"/pt/#top",
		);
		expect(screen.getByRole("link", { name: /^Código-fonte/ })).toBeInTheDocument();
	});
});
