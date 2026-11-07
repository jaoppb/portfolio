import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Link } from "./link";

describe("Link component", () => {
	it("renders an internal anchor without new-tab attributes", () => {
		render(<Link href="#top">Back to top</Link>);

		const link = screen.getByRole("link", { name: "Back to top" });
		expect(link).toHaveAttribute("href", "#top");
		expect(link).not.toHaveAttribute("target");
		expect(link).not.toHaveAttribute("rel");
	});

	it("opens external links in a new tab with a hidden announcement", async () => {
		const { container } = render(
			<Link href="https://example.com" external newTabLabel="(opens in a new tab)">
				Source code
			</Link>,
		);

		const link = screen.getByRole("link", { name: "Source code (opens in a new tab)" });
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(await axe(container)).toHaveNoViolations();
	});

	it("merges a custom className", () => {
		render(
			<Link href="#x" className="custom">
				x
			</Link>,
		);
		expect(screen.getByRole("link")).toHaveClass("custom");
	});
});
