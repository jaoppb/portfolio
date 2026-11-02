const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const siteConfig = {
	name: "João Pedro",
	url: process.env.NEXT_PUBLIC_SITE_URL || "https://joaopedro.dev",
	locales,
	defaultLocale: "en" as Locale,
};
