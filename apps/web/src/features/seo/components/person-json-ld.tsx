import { type Locale, siteConfig } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";

function buildPersonJsonLd(locale: Locale, dict: Dictionary) {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: dict.hero.name,
		jobTitle: dict.hero.role,
		description: dict.meta.description,
		url: `${siteConfig.url}/${locale}`,
		sameAs: Object.values(siteConfig.profiles),
	};
}

export function PersonJsonLd({ locale, dict }: { locale: Locale; dict: Dictionary }) {
	// `<` is escaped so no string value can close the script element.
	const json = JSON.stringify(buildPersonJsonLd(locale, dict)).replace(/</g, "\\u003c");
	// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw JSON; the payload is built from static config and `<` is escaped above.
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
