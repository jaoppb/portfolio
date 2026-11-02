import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import RootPage from "./page";

describe("RootPage redirect fallback", () => {
	it("renders fallback redirect link pointing to /en", () => {
		render(<RootPage />);

		const link = screen.getByRole("link", { name: "/en" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/en");
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("passes automated accessibility checks with zero violations", async () => {
		const { container } = render(<RootPage />);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
