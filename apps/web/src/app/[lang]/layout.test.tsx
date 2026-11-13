import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LocalizedLayout, { generateStaticParams } from "./layout";

describe("LocalizedLayout", () => {
	it("returns static params for all supported locales", async () => {
		const params = await generateStaticParams();
		expect(params).toEqual([{ lang: "en" }, { lang: "pt" }]);
	});

	it.each([
		["en", "en"],
		["pt", "pt"],
		["de", "en"],
	])("renders the document for /%s in language %s", async (lang, expected) => {
		const html = renderToStaticMarkup(
			await LocalizedLayout({
				params: Promise.resolve({ lang }),
				children: <p>Child content</p>,
			}),
		);

		expect(html).toMatch(new RegExp(`^<html lang="${expected}"`));
		expect(html).toContain("<p>Child content</p>");
	});
});
