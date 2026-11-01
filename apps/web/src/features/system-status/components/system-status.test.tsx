import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SystemStatus } from "./system-status";

describe("SystemStatus feature component", () => {
	it("renders architecture status details and headings", () => {
		render(
			<SystemStatus
				version="0.1.0"
				framework="Next.js 16"
				target="Cloudflare Pages (output: export)"
			/>,
		);

		expect(
			screen.getByRole("heading", { name: /architecture & skeleton status/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/operational/i)).toBeInTheDocument();
		expect(screen.getByText("Cloudflare Pages (output: export)")).toBeInTheDocument();
		expect(screen.getByText("Next.js 16")).toBeInTheDocument();
		expect(screen.getByText("v0.1.0")).toBeInTheDocument();
	});

	it("renders action buttons with accessible roles", () => {
		render(<SystemStatus />);
		expect(screen.getByRole("button", { name: /documentation/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /source specs/i })).toBeInTheDocument();
	});
});
