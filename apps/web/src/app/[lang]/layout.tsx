import type * as React from "react";
import { fontMono, fontSans } from "@/app/fonts";
import "@/app/globals.css";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SkipLink } from "@/components/ui/skip-link";
import { siteConfig } from "@/shared/config/site";
import { getDictionary, isValidLocale } from "@/shared/dictionaries";
import { cn } from "@/shared/utils/cn";

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
				<div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 sm:px-8">
					<header className="relative flex items-center justify-between border-b border-border pb-6">
						<SkipLink href="#main-content">{dict.a11y.skipLink}</SkipLink>

						<div>
							<h1 className="text-lg font-semibold tracking-tight text-foreground">
								{dict.hero.name}
							</h1>
							<p className="font-mono text-xs text-muted">{dict.hero.role}</p>
						</div>

						<div className="flex items-center gap-6">
							<nav aria-label={dict.a11y.mainNavigation}>
								<ul className="flex items-center gap-6 text-sm">
									<li>
										<a
											href="#overview"
											className="text-muted transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
										>
											{dict.nav.overview}
										</a>
									</li>
									<li>
										<a
											href="#architecture"
											className="text-muted transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
										>
											{dict.nav.architecture}
										</a>
									</li>
								</ul>
							</nav>

							<LanguageSwitcher
								currentLocale={locale}
								ariaLabel={dict.a11y.languageSwitcher}
							/>
						</div>
					</header>

					<main id="main-content" tabIndex={-1} className="flex-1 py-10 outline-none">
						{children}
					</main>

					<footer className="border-t border-border pt-6 text-xs text-muted">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<p>{dict.footer.copyright}</p>
							<p className="font-mono text-2xs tabular-nums">
								{dict.footer.milestoneNotice}
							</p>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
