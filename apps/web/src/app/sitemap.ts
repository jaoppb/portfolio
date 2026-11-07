import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	// Preview deploys list nothing; a metadata route cannot be skipped, only emptied.
	if (siteConfig.noindex) return [];

	const languages: Record<string, string> = {
		"x-default": `${siteConfig.url}/${siteConfig.defaultLocale}`,
	};
	for (const locale of siteConfig.locales) {
		languages[locale] = `${siteConfig.url}/${locale}`;
	}

	return siteConfig.locales.map((locale) => ({
		url: `${siteConfig.url}/${locale}`,
		alternates: { languages },
	}));
}
