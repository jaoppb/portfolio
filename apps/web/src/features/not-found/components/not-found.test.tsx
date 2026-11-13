import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { NotFound } from "./not-found";

describe("NotFound", () => {
	it("renders the eyebrow, the page h1, the message and a link back to the home page", async () => {
		const { container } = render(
			<main>
				<NotFound notFound={enDictionary.notFound} homeHref="/en" />
			</main>,
		);

		expect(screen.getByText("Error 404")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 1, name: "Page not found" }),
		).toBeInTheDocument();
		expect(screen.getAllByRole("heading")).toHaveLength(1);
		expect(
			screen.getByText(
				"The page you are looking for does not exist or has moved. Check the address, or go back to the home page.",
			),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/en");
		expect(screen.getByRole("region", { name: "Page not found" })).toBeInTheDocument();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("renders the Portuguese copy and home link", () => {
		render(<NotFound notFound={ptDictionary.notFound} homeHref="/pt" />);

		expect(screen.getByText("Erro 404")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 1, name: "Página não encontrada" }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"A página que você procura não existe ou foi movida. Confira o endereço ou volte para a página inicial.",
			),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Voltar para o início" })).toHaveAttribute(
			"href",
			"/pt",
		);
	});
});
