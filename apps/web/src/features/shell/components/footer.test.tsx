import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { siteConfig } from "@/shared/config/site";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Footer } from "./footer";

describe("Footer", () => {
	it("renders contentinfo with copyright, external source link and back to top", async () => {
		const { container } = render(<Footer dict={enDictionary} />);

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

	it("renders Portuguese labels", () => {
		render(<Footer dict={ptDictionary} />);
		expect(screen.getByRole("link", { name: /^Voltar ao topo/ })).toHaveAttribute(
			"href",
			"#top",
		);
		expect(screen.getByRole("link", { name: /^Código-fonte/ })).toBeInTheDocument();
	});
});
