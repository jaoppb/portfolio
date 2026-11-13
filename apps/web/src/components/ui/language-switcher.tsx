import Link from "next/link";
import { type Locale, siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

export interface LanguageSwitcherProps {
	currentLocale: Locale;
	/**
	 * How the active locale is announced: `page` where its link is the page being viewed (the
	 * home page), `true` on any other page, where it only marks the current language.
	 */
	current: "page" | "true";
	ariaLabel: string;
	className?: string;
}

export function LanguageSwitcher({
	currentLocale,
	current,
	ariaLabel,
	className,
}: LanguageSwitcherProps) {
	return (
		<nav
			aria-label={ariaLabel}
			className={cn("flex items-center font-mono text-xs", className)}
		>
			{siteConfig.locales.map((locale, index) => {
				const isActive = locale === currentLocale;
				return (
					<span key={locale} className="flex items-center">
						{index > 0 && (
							<span aria-hidden="true" className="mx-1 text-muted">
								/
							</span>
						)}
						<Link
							href={`/${locale}`}
							hrefLang={locale}
							aria-current={isActive ? current : undefined}
							className={cn(
								"rounded-sm px-2 py-1 uppercase transition-colors duration-(--duration-base) ease-standard focus-ring",
								isActive
									? "bg-accent font-medium text-accent-foreground"
									: "text-muted hover:text-foreground",
							)}
						>
							{locale}
						</Link>
					</span>
				);
			})}
		</nav>
	);
}
