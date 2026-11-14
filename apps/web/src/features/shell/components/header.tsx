import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Link } from "@/components/ui/link";
import type { Locale } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";
import { navItems } from "../nav-items";

export interface HeaderProps {
	locale: Locale;
	dict: Dictionary;
	/**
	 * Set on the home page, where the sections are: its links are same-page anchors. Elsewhere
	 * they lead to the home page of the locale.
	 */
	homePage?: boolean;
}

export function Header({ locale, dict, homePage = false }: HeaderProps) {
	const hrefBase = homePage ? "" : `/${locale}`;

	return (
		<header className="border-b border-border">
			{/*
			 * No CSS `order` here: the DOM order (wordmark, nav, language switcher) is the visual
			 * order at every width, so the focus order follows it. Below `md` the wordmark takes
			 * its own row and the switcher sits after the links, on their last line; if the widest
			 * link no longer fits beside it (large text on a narrow screen) it wraps below them.
			 */}
			<div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-6 px-5 py-3 md:items-center md:px-10 md:py-4 lg:px-16">
				<div className="flex w-full md:w-auto">
					<Link
						href={`${hrefBase}#top`}
						className="px-0 text-lg tracking-tight text-foreground no-underline hover:underline"
					>
						{dict.hero.name}
					</Link>
				</div>

				<nav
					aria-label={dict.a11y.mainNavigation}
					className="mt-1 min-w-min flex-1 md:mt-0 md:ml-auto md:flex-initial"
				>
					<ul className="flex flex-wrap gap-x-2 gap-y-1">
						{navItems.map((item) => (
							<li key={item.id}>
								<a
									href={`${hrefBase}#${item.id}`}
									className="block rounded-sm p-2 text-sm font-medium text-foreground hover:underline hover:underline-offset-4 focus-ring"
								>
									{dict.nav[item.label]}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<LanguageSwitcher
					currentLocale={locale}
					current={homePage ? "page" : "true"}
					ariaLabel={dict.a11y.languageSwitcher}
					// As tall as one line of nav links (`h-9`), so it is centred on the last one.
					className="ml-auto h-9 md:ml-0 md:h-auto"
				/>
			</div>
		</header>
	);
}
