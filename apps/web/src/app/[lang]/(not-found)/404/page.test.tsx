import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundPage, { generateMetadata, generateStaticParams } from "./page";

describe("NotFoundPage", () => {
	it("returns static params for both locales", async () => {
		expect(await generateStaticParams()).toEqual([{ lang: "en" }, { lang: "pt" }]);
	});

	it.each([
		["en", "Page not found — João Pedro"],
		["pt", "Página não encontrada — João Pedro"],
	])("is titled in %s, never indexed and has no canonical", async (lang, title) => {
		const meta = await generateMetadata({ params: Promise.resolve({ lang }) });
		expect(meta.title).toBe(title);
		expect(meta.robots).toEqual({ index: false, follow: false });
		expect(meta.alternates).toBeUndefined();
	});

	it.each([
		["en", "Page not found", "Back to home"],
		["pt", "Página não encontrada", "Voltar para o início"],
	])("renders the %s 404 with a link to that locale's home page", async (lang, title, home) => {
		render(await NotFoundPage({ params: Promise.resolve({ lang }) }));

		expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: home })).toHaveAttribute("href", `/${lang}`);
	});
});
