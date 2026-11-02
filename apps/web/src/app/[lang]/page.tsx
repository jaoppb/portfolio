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

	return {
		title: dict.meta.title,
		description: dict.meta.description,
		alternates: {
			canonical: url,
			languages: {
				en: `${siteConfig.url}/en`,
				pt: `${siteConfig.url}/pt`,
				"x-default": `${siteConfig.url}/en`,
			},
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
		<main id="main-content" tabIndex={-1} className="flex flex-col gap-10 outline-none">
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
				<SystemStatus
					target={dict.systemStatus.targetValue}
					framework={dict.systemStatus.frameworkValue}
					labels={{
						title: dict.systemStatus.title,
						description: dict.systemStatus.description,
						operational: dict.systemStatus.operational,
						target: dict.systemStatus.target,
						framework: dict.systemStatus.framework,
						milestone: dict.systemStatus.milestone,
						documentation: dict.systemStatus.documentation,
						sourceSpecs: dict.systemStatus.sourceSpecs,
					}}
				/>
			</section>
		</main>
	);
}
