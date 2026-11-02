import type { Metadata } from "next";
import { SystemStatus } from "@/features/system-status/components/system-status";
import { siteConfig } from "@/shared/config/site";
import { getDictionary, isValidLocale } from "@/shared/dictionaries";

export async function generateStaticParams() {
	return siteConfig.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const locale = isValidLocale(lang) ? lang : siteConfig.defaultLocale;
	const dict = await getDictionary(locale);

	const url = `${siteConfig.url}/${locale}`;

	const languages: Record<string, string> = {
		"x-default": `${siteConfig.url}/${siteConfig.defaultLocale}`,
	};
	for (const loc of siteConfig.locales) {
		languages[loc] = `${siteConfig.url}/${loc}`;
	}

	return {
		title: dict.meta.title,
		description: dict.meta.description,
		alternates: {
			canonical: url,
			languages,
		},
		openGraph: {
			title: dict.meta.title,
			description: dict.meta.description,
			url,
			siteName: dict.meta.siteName,
			locale: locale === "pt" ? "pt_BR" : "en_US",
			alternateLocale: locale === "pt" ? ["en_US"] : ["pt_BR"],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: dict.meta.title,
			description: dict.meta.description,
		},
	};
}

export default async function LocalizedPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	const locale = isValidLocale(lang) ? lang : siteConfig.defaultLocale;
	const dict = await getDictionary(locale);

	return (
		<div className="flex flex-col gap-10">
			<section id="overview" aria-labelledby="hero-title" className="space-y-4">
				<h2
					id="hero-title"
					className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
				>
					{dict.hero.headline}
				</h2>
				<p className="max-w-2xl text-base leading-relaxed text-muted">
					{dict.hero.description}
				</p>
			</section>

			<section id="architecture">
				<SystemStatus status={dict.systemStatus} />
			</section>
		</div>
	);
}
