import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { siteConfig } from "@/shared/config/site";
import { enDictionary } from "@/shared/dictionaries/en";
import { ptDictionary } from "@/shared/dictionaries/pt";
import { Contact } from "./contact";

const cases = [
	["en", enDictionary],
	["pt", ptDictionary],
] as const;

function renderContact(locale: "en" | "pt") {
	const dict = locale === "en" ? enDictionary : ptDictionary;
	return render(
		<Contact locale={locale} contact={dict.contact} newTabLabel={dict.a11y.opensInNewTab} />,
	);
}

describe("Contact", () => {
	it.each(cases)("renders the heading and lead (%s)", async (locale, dict) => {
		const { container } = renderContact(locale);

		expect(screen.getByRole("heading", { level: 2, name: dict.contact.title })).toBeVisible();
		expect(screen.getByText(dict.contact.lead)).toBeInTheDocument();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("exposes id=contact so the nav and hero CTA anchors resolve", () => {
		renderContact("en");
		expect(screen.getByRole("region", { name: enDictionary.contact.title })).toHaveAttribute(
			"id",
			"contact",
		);
	});

	it("links the email with a plain mailto taken from siteConfig", () => {
		renderContact("en");
		const link = screen.getByRole("link", { name: siteConfig.email });
		expect(link).toHaveAttribute("href", `mailto:${siteConfig.email}`);
		expect(link).not.toHaveAttribute("target");
	});

	it.each([
		["github", siteConfig.profiles.github],
		["linkedin", siteConfig.profiles.linkedin],
	] as const)("opens the %s profile safely in a new tab", (_name, url) => {
		renderContact("en");
		const link = screen.getByRole("link", {
			name: `${url.replace("https://", "")} ${enDictionary.a11y.opensInNewTab}`,
		});
		expect(link).toHaveAttribute("href", url);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it.each(cases)("offers both CVs with view and download links (%s)", (locale, dict) => {
		renderContact(locale);
		for (const lang of ["en", "pt"] as const) {
			const { view, download, downloadLabel } = dict.contact.cv[lang];
			const href = `/cv-joao-pedro-${lang}.pdf`;

			const viewLink = screen.getByRole("link", {
				name: `${view} ${dict.a11y.opensInNewTab}`,
			});
			expect(viewLink).toHaveAttribute("href", href);
			expect(viewLink).toHaveAttribute("target", "_blank");
			expect(viewLink).toHaveAttribute("rel", "noopener noreferrer");

			const downloadLink = screen.getByRole("link", { name: downloadLabel });
			expect(downloadLink).toHaveAttribute("href", href);
			expect(downloadLink).toHaveAttribute("download");
			expect(downloadLink).not.toHaveAttribute("target");
			expect(downloadLink).toHaveTextContent(download);
			// WCAG 2.5.3: the visible text is part of the accessible name.
			expect(downloadLabel).toContain(download);
		}
	});

	it.each(cases)("makes the page's own language the primary CV (%s)", (locale, dict) => {
		renderContact(locale);
		const other = locale === "en" ? "pt" : "en";
		const own = screen.getByRole("link", {
			name: (name) => name.startsWith(dict.contact.cv[locale].view),
		});
		const alt = screen.getByRole("link", {
			name: (name) => name.startsWith(dict.contact.cv[other].view),
		});

		expect(own.className).toContain("bg-accent");
		expect(alt.className).not.toContain("bg-accent");
		expect(alt.className).toContain("border-border-strong");
		// Own-language CV comes first in DOM and focus order.
		expect(own.compareDocumentPosition(alt) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});
});

describe("CV files", () => {
	it.each(["en", "pt"])("ships a real PDF for %s in public/", (lang) => {
		const path = join(process.cwd(), "public", `cv-joao-pedro-${lang}.pdf`);
		expect(existsSync(path)).toBe(true);
		expect(readFileSync(path).subarray(0, 5).toString()).toBe("%PDF-");
	});
});
