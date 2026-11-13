import type { Metadata } from "next";
import type * as React from "react";
import "@/app/globals.css";
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
 * Document only. Each page brings the shell: the home page renders it itself, because moving it
 * into a route group would detach it from `opengraph-image.tsx` (or rename that image's URL);
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
