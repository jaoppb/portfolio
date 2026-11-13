import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GlobalNotFound, { generateMetadata } from "./global-not-found";

describe("GlobalNotFound (root 404.html)", () => {
	it("is titled in the default locale", async () => {
		expect((await generateMetadata()).title).toBe("Page not found — João Pedro");
	});

	it("renders a full English document with the shell linking to /en", async () => {
		const html = renderToStaticMarkup(await GlobalNotFound());

		expect(html).toMatch(/^<html lang="en"/);
		expect(html).toContain(">Page not found</h1>");
		expect(html).toContain('href="/en#about"');
		expect(html).toMatch(/<a[^>]*href="\/en"[^>]*>Back to home<\/a>/);
		expect(html).toMatch(/<a[^>]*aria-current="true"[^>]*>en<\/a>/);
	});
});
