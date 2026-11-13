import type { Metadata } from "next";
import "@/app/globals.css";
import { LocaleDocument } from "@/app/locale-document";
import { NotFound } from "@/features/not-found/components/not-found";
import { SiteShell } from "@/features/shell/components/site-shell";
import { siteConfig } from "@/shared/config/site";
import { getDictionary } from "@/shared/dictionaries";

/**
 * Exported as the root `404.html`: the answer to unknown paths outside `/en` and `/pt`, in the
 * default locale. It needs `experimental.globalNotFound` (see `next.config.ts`) because the app
 * has two root layouts, and it bypasses them, so it renders the whole document itself.
 */
const locale = siteConfig.defaultLocale;
const homeHref = `/${locale}`;

export async function generateMetadata(): Promise<Metadata> {
	const dict = await getDictionary(locale);

	return { title: dict.notFound.metaTitle };
}

export default async function GlobalNotFound() {
	const dict = await getDictionary(locale);

	return (
		<LocaleDocument locale={locale}>
			<SiteShell locale={locale} dict={dict} hrefBase={homeHref}>
				<NotFound notFound={dict.notFound} homeHref={homeHref} />
			</SiteShell>
		</LocaleDocument>
	);
}
