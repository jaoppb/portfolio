import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
	it("renders main hero heading and system status section", () => {
		render(<HomePage />);

		expect(
			screen.getByRole("heading", {
				name: /engineering robust, verifiable systems/i,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByRole("heading", {
				name: /architecture & skeleton status/i,
			}),
		).toBeInTheDocument();
	});
});
