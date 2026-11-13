import type { Metadata } from "next";
import type * as React from "react";
import { LocaleDocument } from "@/app/locale-document";
import { robotsMetadata, siteConfig } from "@/shared/config/site";
import { resolveLocale } from "@/shared/dictionaries";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	robots: robotsMetadata,
};

export async function generateStaticParams() {
	return siteConfig.locales.map((lang) => ({ lang }));
}

/**
 * Document only. Each page brings the shell: the home page renders it itself, because in a
 * route group its own `openGraph` metadata would replace the image of `opengraph-image.tsx`
 * (and moving the image along renames its URL);
 * the 404 gets it from the `(not-found)` layout.
 */
export default async function LocalizedLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	return <LocaleDocument locale={resolveLocale((await params).lang)}>{children}</LocaleDocument>;
}
