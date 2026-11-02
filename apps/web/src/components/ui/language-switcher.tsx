import Link from "next/link";
import { type Locale, siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

export interface LanguageSwitcherProps {
	currentLocale: Locale;
	ariaLabel: string;
	className?: string;
}

export function LanguageSwitcher({ currentLocale, ariaLabel, className }: LanguageSwitcherProps) {
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
							aria-current={isActive ? "page" : undefined}
							className={cn(
								"rounded px-1.5 py-0.5 uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
								isActive
									? "bg-accent font-semibold text-accent-foreground"
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
