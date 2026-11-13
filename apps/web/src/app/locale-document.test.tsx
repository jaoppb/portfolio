import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocaleDocument } from "./locale-document";

describe("LocaleDocument", () => {
	it.each(["en", "pt"] as const)(
		"renders an html document in %s with the font variables",
		(locale) => {
			const html = renderToStaticMarkup(
				<LocaleDocument locale={locale}>
					<p>Child content</p>
				</LocaleDocument>,
			);

			expect(html).toMatch(new RegExp(`^<html lang="${locale}" class="[^"]+">`));
			expect(html).toContain(
				'<body class="min-h-screen bg-background text-foreground antialiased">',
			);
			expect(html).toContain("<p>Child content</p>");
		},
	);
});
