import { isNoindex, resolveSiteUrl } from "./site-url";

const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const siteConfig = {
	name: "João Pedro",
	url: resolveSiteUrl(process.env),
	noindex: isNoindex(process.env),
	repositoryUrl: "https://github.com/jaoppb/portfolio",
	/** Public profiles, also used as JSON-LD `sameAs` and reusable by the contact section. */
	profiles: {
		github: "https://github.com/jaoppb",
		linkedin: "https://linkedin.com/in/joao-pedro-peres-barbosa",
	},
	locales,
	defaultLocale: "en" as Locale,
};

/** Page-level robots metadata: noindex on preview deploys, nothing on production. */
export const robotsMetadata = siteConfig.noindex
	? ({ index: false, follow: false } as const)
	: undefined;
