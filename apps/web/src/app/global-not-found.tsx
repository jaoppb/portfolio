import type { Metadata } from "next";
import { LocaleDocument } from "@/app/locale-document";
import { NotFound } from "@/features/not-found/components/not-found";
import { SiteShell } from "@/features/shell/components/site-shell";
import { siteConfig } from "@/shared/config/site";
import { getDictionary } from "@/shared/dictionaries";

const locale = siteConfig.defaultLocale;

export async function generateMetadata(): Promise<Metadata> {
	const dict = await getDictionary(locale);

	return { title: dict.notFound.metaTitle };
}

/**
 * Exported as the root `404.html`: the answer to unknown paths outside `/en` and `/pt`, in the
 * default locale. It needs `experimental.globalNotFound` (see `next.config.ts`) because the app
 * has two root layouts, and it bypasses them, so it renders the whole document itself.
 */
export default async function GlobalNotFound() {
	const dict = await getDictionary(locale);

	return (
		<LocaleDocument locale={locale}>
			<SiteShell locale={locale} dict={dict}>
				<NotFound notFound={dict.notFound} homeHref={`/${locale}`} />
			</SiteShell>
		</LocaleDocument>
	);
}
