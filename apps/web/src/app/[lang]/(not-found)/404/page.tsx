import type { Metadata } from "next";
import { NotFound } from "@/features/not-found/components/not-found";
import { siteConfig } from "@/shared/config/site";
import { getDictionary, resolveLocale } from "@/shared/dictionaries";

export async function generateStaticParams() {
	return siteConfig.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const dict = await getDictionary((await params).lang);

	return {
		title: dict.notFound.metaTitle,
		// Always: the file is also reachable as `/<locale>/404`, where it answers 200.
		robots: { index: false, follow: false },
	};
}

/**
 * Exported as `/<locale>/404.html`. Cloudflare Pages answers an unknown path with the nearest
 * `404.html` up the directory tree, so `/pt/anything` gets this page in Portuguese with a 404
 * status. Paths outside a locale get the root `404.html` (`app/global-not-found.tsx`).
 */
export default async function NotFoundPage({ params }: { params: Promise<{ lang: string }> }) {
	const locale = resolveLocale((await params).lang);
	const dict = await getDictionary(locale);

	return <NotFound notFound={dict.notFound} homeHref={`/${locale}`} />;
}
