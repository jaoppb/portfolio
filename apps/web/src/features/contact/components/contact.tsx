import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { type Locale, siteConfig } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface ContactProps {
	locale: Locale;
	contact: Dictionary["contact"];
	newTabLabel: string;
}

/** Visible text of a profile link: the URL without its scheme. */
function displayUrl(url: string) {
	return url.replace(/^https?:\/\//, "");
}

export function Contact({ locale, contact, newTabLabel }: ContactProps) {
	// The page's own language comes first and is the primary action.
	const cvs = [locale, ...siteConfig.locales.filter((cv) => cv !== locale)];

	return (
		<Section id="contact" labelledBy="contact-title" rule>
			<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
				<div className="flex flex-col gap-3">
					<h2
						id="contact-title"
						className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
					>
						{contact.title}
					</h2>
					<p className="max-w-xl text-base text-muted">{contact.lead}</p>
				</div>
				<dl className="flex w-full flex-col md:max-w-xl">
					<ContactRow label={contact.email}>
						<Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>
					</ContactRow>
					<ContactRow label={contact.github}>
						<Link href={siteConfig.profiles.github} external newTabLabel={newTabLabel}>
							{displayUrl(siteConfig.profiles.github)}
						</Link>
					</ContactRow>
					<ContactRow label={contact.linkedin}>
						<Link
							href={siteConfig.profiles.linkedin}
							external
							newTabLabel={newTabLabel}
						>
							{displayUrl(siteConfig.profiles.linkedin)}
						</Link>
					</ContactRow>
				</dl>
				<div className="flex flex-wrap gap-x-6 gap-y-3">
					{cvs.map((cv) => {
						const { view, download, downloadLabel } = contact.cv[cv];
						const href = `/cv-joao-pedro-${cv}.pdf`;
						return (
							<div key={cv} className="flex flex-wrap items-center gap-x-4 gap-y-2">
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={buttonStyles({
										variant: cv === locale ? "primary" : "outline",
									})}
								>
									{view} <span className="sr-only">{newTabLabel}</span>
								</a>
								<Link
									href={href}
									download
									aria-label={downloadLabel}
									className="text-sm"
								>
									{download}
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</Section>
	);
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-start gap-1 border-t border-border py-2 min-[360px]:flex-row min-[360px]:items-center min-[360px]:gap-4">
			<dt className="w-18 shrink-0 font-mono text-xs text-muted">{label}</dt>
			<dd className="min-w-0 break-words text-sm">{children}</dd>
		</div>
	);
}
