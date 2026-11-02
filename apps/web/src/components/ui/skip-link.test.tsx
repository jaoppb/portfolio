import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SkipLink } from "./skip-link";

describe("SkipLink component", () => {
	it("renders accessible skip link with default href", () => {
		render(<SkipLink>Skip to main content</SkipLink>);

		const link = screen.getByRole("link", { name: "Skip to main content" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "#main-content");
		expect(link).toHaveClass("sr-only");
		expect(link).toHaveClass("focus:not-sr-only");
	});

	it("supports custom href and additional classes", () => {
		render(
			<SkipLink href="#custom-target" className="custom-class">
				Pular para o conteúdo
			</SkipLink>,
		);

		const link = screen.getByRole("link", { name: "Pular para o conteúdo" });
		expect(link).toHaveAttribute("href", "#custom-target");
		expect(link).toHaveClass("custom-class");
	});

	it("passes automated accessibility checks with zero violations", async () => {
		const { container } = render(
			<main>
				<SkipLink href="#content">Skip to content</SkipLink>
				<div id="content">Content area</div>
			</main>,
		);

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
