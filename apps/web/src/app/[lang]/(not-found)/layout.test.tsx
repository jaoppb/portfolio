import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundLayout from "./layout";

describe("NotFoundLayout", () => {
	it("wraps the 404 in the shell with links back to the locale home page", async () => {
		render(
			await NotFoundLayout({
				params: Promise.resolve({ lang: "pt" }),
				children: <div data-testid="child-content">Conteúdo</div>,
			}),
		);

		expect(screen.getByRole("main")).toContainElement(screen.getByTestId("child-content"));
		expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "/pt#about");
		expect(screen.getByRole("link", { name: "João Pedro" })).toHaveAttribute("href", "/pt#top");
		expect(screen.getByRole("link", { name: "pt" })).toHaveAttribute("aria-current", "true");
		expect(screen.getByRole("link", { name: "en" })).toHaveAttribute("href", "/en");
	});
});
