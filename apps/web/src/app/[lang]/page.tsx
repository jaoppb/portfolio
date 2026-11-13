import type { Metadata } from "next";
import { About } from "@/features/about/components/about";
import { Contact } from "@/features/contact/components/contact";
import { Experience } from "@/features/experience/components/experience";
import { Skills } from "@/features/experience/components/skills";
import { Hero } from "@/features/hero/components/hero";
import { Projects } from "@/features/portfolio-showcase/components/projects";
import { PersonJsonLd } from "@/features/seo/components/person-json-ld";
import { SiteShell } from "@/features/shell/components/site-shell";
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
	const locale = resolveLocale((await params).lang);
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
	const locale = resolveLocale((await params).lang);
	const dict = await getDictionary(locale);

	return (
		<SiteShell locale={locale} dict={dict}>
			<PersonJsonLd locale={locale} dict={dict} />
			<Hero hero={dict.hero} />
			<About about={dict.about} />
			<Projects
				locale={locale}
				projects={dict.projects}
				newTabLabel={dict.a11y.opensInNewTab}
			/>
			<Experience locale={locale} experience={dict.experience} />
			<Skills skills={dict.skills} />
			<Contact locale={locale} contact={dict.contact} newTabLabel={dict.a11y.opensInNewTab} />
		</SiteShell>
	);
}
