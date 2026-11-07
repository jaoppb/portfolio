import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/shared/config/site";
import { getDictionary } from "@/shared/dictionaries";
import { PersonJsonLd } from "./person-json-ld";

describe("PersonJsonLd", () => {
	it.each(["en", "pt"] as const)("renders a valid Person for %s", async (locale) => {
		const dict = await getDictionary(locale);
		const { container } = render(<PersonJsonLd locale={locale} dict={dict} />);

		const script = container.querySelector('script[type="application/ld+json"]');
		const data = JSON.parse(script?.textContent ?? "");

		expect(data).toEqual({
			"@context": "https://schema.org",
			"@type": "Person",
			name: dict.hero.name,
			jobTitle: dict.hero.role,
			description: dict.meta.description,
			url: `${siteConfig.url}/${locale}`,
			sameAs: [siteConfig.profiles.github, siteConfig.profiles.linkedin],
		});
	});

	it("escapes < so values cannot close the script element", async () => {
		const dict = await getDictionary("en");
		const { container } = render(
			<PersonJsonLd
				locale="en"
				dict={{ ...dict, meta: { ...dict.meta, description: "</script><b>" } }}
			/>,
		);
		const raw = container.querySelector("script")?.innerHTML ?? "";
		expect(raw).not.toContain("</script>");
		expect(JSON.parse(raw).description).toBe("</script><b>");
	});
});
