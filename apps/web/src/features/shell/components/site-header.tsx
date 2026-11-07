import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Link } from "@/components/ui/link";
import type { Locale } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";
import { navItems } from "../nav-items";

export interface SiteHeaderProps {
	locale: Locale;
	dict: Dictionary;
	/** Prefix for in-page anchors; empty for same-page links, `/<locale>/` on other pages. */
	hrefBase?: string;
}

export function SiteHeader({ locale, dict, hrefBase = "" }: SiteHeaderProps) {
	return (
		<header className="border-b border-border">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 px-5 py-3 md:px-10 md:py-4 lg:px-16">
				<Link
					href={`${hrefBase}#top`}
					className="order-1 px-0 text-lg tracking-tight text-foreground no-underline hover:underline"
				>
					{dict.hero.name}
				</Link>

				<nav
					aria-label={dict.a11y.mainNavigation}
					className="order-3 mt-1 w-full md:order-2 md:mt-0 md:ml-auto md:w-auto"
				>
					<ul className="flex flex-wrap gap-x-2 gap-y-1">
						{navItems.map((item) => (
							<li key={item.id}>
								<a
									href={`${hrefBase}#${item.id}`}
									className="block rounded-sm p-2 text-sm font-medium text-foreground transition-colors duration-(--duration-base) ease-standard hover:underline hover:underline-offset-4 focus-ring"
								>
									{dict.nav[item.label]}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<LanguageSwitcher
					currentLocale={locale}
					ariaLabel={dict.a11y.languageSwitcher}
					className="order-2 ml-auto md:order-3 md:ml-0"
				/>
			</div>
		</header>
	);
}
