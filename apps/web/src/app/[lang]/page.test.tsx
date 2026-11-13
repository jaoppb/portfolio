import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { siteConfig } from "@/shared/config/site";
import LocalizedPage, { generateMetadata, generateStaticParams } from "./page";

/** Whole-page axe runs in jsdom are slow once every section is on the page. */
const AXE_TIMEOUT = 20_000;

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
		expect(enMeta.alternates?.canonical).toBe(`${siteConfig.url}/en`);
		expect(enMeta.alternates?.languages).toEqual({
			en: `${siteConfig.url}/en`,
			pt: `${siteConfig.url}/pt`,
			"x-default": `${siteConfig.url}/en`,
		});
		expect(enMeta.openGraph?.locale).toBe("en_US");

		const ptMeta = await generateMetadata({
			params: Promise.resolve({ lang: "pt" }),
		});
		expect(ptMeta.title).toBe("João Pedro — Engenheiro de Software");
		expect(ptMeta.alternates?.canonical).toBe(`${siteConfig.url}/pt`);
		expect(ptMeta.openGraph?.locale).toBe("pt_BR");
	});

	it(
		"renders English page content and headings",
		async () => {
			const Page = await LocalizedPage({
				params: Promise.resolve({ lang: "en" }),
			});
			const { container } = render(<main>{Page}</main>);

			expect(
				screen.getByRole("heading", {
					level: 1,
					name: /full stack engineer focused on architecture and cloud/i,
				}),
			).toBeInTheDocument();

			expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
			expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
			expect(container.querySelector("#about")).not.toBeNull();
			expect(container.querySelector("#hero")).not.toBeNull();
			expect(container.querySelector("#experience")).not.toBeNull();
			expect(container.querySelector("#skills")).not.toBeNull();

			expect(
				screen.getByRole("heading", {
					level: 2,
					name: /architecture & skeleton status/i,
				}),
			).toBeInTheDocument();

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		},
		AXE_TIMEOUT,
	);

	it(
		"renders Portuguese page content and headings",
		async () => {
			const Page = await LocalizedPage({
				params: Promise.resolve({ lang: "pt" }),
			});
			const { container } = render(<main>{Page}</main>);

			expect(
				screen.getByRole("heading", {
					level: 1,
					name: /engenheiro full stack com foco em arquitetura e cloud/i,
				}),
			).toBeInTheDocument();

			expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
			expect(screen.getByRole("heading", { level: 2, name: "Sobre" })).toBeInTheDocument();

			expect(
				screen.getByRole("heading", {
					level: 2,
					name: /status de arquitetura e skeleton/i,
				}),
			).toBeInTheDocument();

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		},
		AXE_TIMEOUT,
	);
});
