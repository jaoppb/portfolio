import type * as React from "react";
import { SkipLink } from "@/components/ui/skip-link";
import type { Locale } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";
import { Footer } from "./footer";
import { Header } from "./header";

export interface SiteShellProps {
	locale: Locale;
	dict: Dictionary;
	/** Set by the home page only; see `Header`. */
	homePage?: boolean;
	children: React.ReactNode;
}

/** Page chrome shared by every page: skip link, header, the `main` landmark and footer. */
export function SiteShell({ locale, dict, homePage, children }: SiteShellProps) {
	return (
		<div id="top" className="flex min-h-screen flex-col">
			<SkipLink href="#main-content">{dict.a11y.skipLink}</SkipLink>
			<Header locale={locale} dict={dict} homePage={homePage} />

			<main
				id="main-content"
				tabIndex={-1}
				className="mx-auto w-full max-w-7xl flex-1 px-5 outline-none md:px-10 lg:px-16"
			>
				{children}
			</main>

			<Footer dict={dict} />
		</div>
	);
}
