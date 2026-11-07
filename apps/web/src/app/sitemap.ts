import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

// With NEXT_PUBLIC_ROBOTS_NOINDEX=1 the exported file is removed by scripts/postbuild.mjs:
// a metadata route cannot be skipped, only emitted.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
