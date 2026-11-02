import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { SystemStatus } from "./system-status";

describe("SystemStatus feature component", () => {
	it("renders architecture status details and headings", () => {
		render(<SystemStatus version="0.1.0" />);

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

	it("renders localized translations when status dictionary slice is provided", () => {
		render(<SystemStatus status={ptDictionary.systemStatus} version="0.1.0" />);

		expect(
			screen.getByRole("heading", {
				name: /status de arquitetura e skeleton/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/operacional/i)).toBeInTheDocument();
		expect(screen.getByText(/especificações/i)).toBeInTheDocument();
		expect(screen.getByText(/documentação/i)).toBeInTheDocument();
	});
});
