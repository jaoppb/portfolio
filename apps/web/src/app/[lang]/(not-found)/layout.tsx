import type * as React from "react";
import { SiteShell } from "@/features/shell/components/site-shell";
import { getDictionary, resolveLocale } from "@/shared/dictionaries";

/** Same chrome as the home page, with the header linking back to that locale's home page. */
export default async function NotFoundLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const locale = resolveLocale((await params).lang);

	return (
		<SiteShell locale={locale} dict={await getDictionary(locale)}>
			{children}
		</SiteShell>
	);
}
