import { Link } from "@/components/ui/link";
import { siteConfig } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface FooterProps {
	dict: Dictionary;
	/** Prefix for in-page anchors; empty for same-page links, `/<locale>/` on other pages. */
	hrefBase?: string;
}

export function Footer({ dict, hrefBase = "" }: FooterProps) {
	return (
		<footer className="border-t border-border">
			<div className="mx-auto flex max-w-7xl flex-col gap-y-1 px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-16">
				<p className="text-sm text-muted">{dict.footer.copyright}</p>
				<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
					<Link
						href={siteConfig.repositoryUrl}
						external
						newTabLabel={dict.a11y.opensInNewTab}
					>
						{dict.footer.sourceCode}
						<span aria-hidden="true"> ↗</span>
					</Link>
					<Link href={`${hrefBase}#top`}>
						{dict.footer.backToTop}
						<span aria-hidden="true"> ↑</span>
					</Link>
				</div>
			</div>
		</footer>
	);
}
