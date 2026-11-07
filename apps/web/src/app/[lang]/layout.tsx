import type { Metadata } from "next";
import type * as React from "react";
import { fontMono, fontSans } from "@/app/fonts";
import "@/app/globals.css";
import { SkipLink } from "@/components/ui/skip-link";
import { Footer } from "@/features/shell/components/footer";
import { Header } from "@/features/shell/components/header";
import { robotsMetadata, siteConfig } from "@/shared/config/site";
import { getDictionary, isValidLocale } from "@/shared/dictionaries";
import { cn } from "@/shared/utils/cn";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	robots: robotsMetadata,
};

export async function generateStaticParams() {
	return siteConfig.locales.map((lang) => ({ lang }));
}

export default async function LocalizedLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const locale = isValidLocale(lang) ? lang : siteConfig.defaultLocale;
	const dict = await getDictionary(locale);

	return (
		<html lang={locale} className={cn(fontSans.variable, fontMono.variable)}>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<div id="top" className="flex min-h-screen flex-col">
					<SkipLink href="#main-content">{dict.a11y.skipLink}</SkipLink>
					<Header locale={locale} dict={dict} />

					<main
						id="main-content"
						tabIndex={-1}
						className="mx-auto w-full max-w-7xl flex-1 px-5 outline-none md:px-10 lg:px-16"
					>
						{children}
					</main>

					<Footer dict={dict} />
				</div>
			</body>
		</html>
	);
}
