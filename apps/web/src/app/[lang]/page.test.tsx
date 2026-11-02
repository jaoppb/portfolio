import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import LocalizedPage, { generateMetadata, generateStaticParams } from "./page";

describe("LocalizedPage", () => {
	it("returns static params for both en and pt locales", async () => {
		const params = await generateStaticParams();
		expect(params).toEqual([{ lang: "en" }, { lang: "pt" }]);
	});

	it("generates correct localized metadata for en and pt", async () => {
		const enMeta = await generateMetadata({
			params: Promise.resolve({ lang: "en" }),
		});
		expect(enMeta.title).toBe("João Pedro — Software Engineer");
		expect(enMeta.alternates?.canonical).toBe("https://joaopedro.dev/en");
		expect(enMeta.alternates?.languages).toEqual({
			en: "https://joaopedro.dev/en",
			pt: "https://joaopedro.dev/pt",
			"x-default": "https://joaopedro.dev/en",
		});
		expect(enMeta.openGraph?.locale).toBe("en_US");

		const ptMeta = await generateMetadata({
			params: Promise.resolve({ lang: "pt" }),
		});
		expect(ptMeta.title).toBe("João Pedro — Engenheiro de Software");
		expect(ptMeta.alternates?.canonical).toBe("https://joaopedro.dev/pt");
		expect(ptMeta.openGraph?.locale).toBe("pt_BR");
	});

	it("renders English page content and headings", async () => {
		const Page = await LocalizedPage({
			params: Promise.resolve({ lang: "en" }),
		});
		const { container } = render(<main>{Page}</main>);

		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /engineering robust, verifiable systems/i,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /architecture & skeleton status/i,
			}),
		).toBeInTheDocument();

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it("renders Portuguese page content and headings", async () => {
		const Page = await LocalizedPage({
			params: Promise.resolve({ lang: "pt" }),
		});
		const { container } = render(<main>{Page}</main>);

		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /engenharia de sistemas robustos e verificáveis/i,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /status de arquitetura e skeleton/i,
			}),
		).toBeInTheDocument();

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
