import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

describe("Section", () => {
	it("renders a labelled region with the given id", () => {
		render(
			<Section id="about" labelledBy="about-title">
				<h2 id="about-title">About</h2>
			</Section>,
		);
		const region = screen.getByRole("region", { name: "About" });
		expect(region).toHaveAttribute("id", "about");
	});

	it("draws a top rule only when asked", () => {
		const { rerender } = render(
			<Section id="a" data-testid="s">
				x
			</Section>,
		);
		expect(screen.getByTestId("s")).not.toHaveClass("border-t");
		rerender(
			<Section id="a" rule data-testid="s">
				x
			</Section>,
		);
		expect(screen.getByTestId("s")).toHaveClass("border-t", "border-border");
	});

	it("uses the responsive vertical padding scale", () => {
		render(
			<Section id="a" data-testid="s">
				x
			</Section>,
		);
		expect(screen.getByTestId("s")).toHaveClass("py-16", "md:py-20", "lg:py-24");
	});
});
