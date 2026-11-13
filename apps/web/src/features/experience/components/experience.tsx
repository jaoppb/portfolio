import { Section } from "@/components/ui/section";
import type { Locale } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";
import { formatMonth } from "../format-month";

export interface ExperienceProps {
	locale: Locale;
	experience: Dictionary["experience"];
}

export function Experience({ locale, experience }: ExperienceProps) {
	return (
		<Section id="experience" labelledBy="experience-title" rule>
			<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
				<h2
					id="experience-title"
					className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
				>
					{experience.title}
				</h2>
				<ol aria-labelledby="experience-title">
					{experience.entries.map(({ role, company, start, end, highlights }) => (
						<li
							key={start}
							className="flex flex-col gap-2 border-t border-border py-6 md:flex-row md:gap-6"
						>
							<p className="font-mono text-sm tabular-nums text-muted md:w-50 md:shrink-0">
								<time dateTime={start}>{formatMonth(start, locale)}</time>
								{" – "}
								{end ? (
									<time dateTime={end}>{formatMonth(end, locale)}</time>
								) : (
									<span>{experience.present}</span>
								)}
							</p>
							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<h3 className="text-lg font-medium tracking-tight text-foreground">
									{role}
								</h3>
								<p className="text-sm text-muted">{company}</p>
								<ul className="flex flex-col gap-2 py-2 text-base text-foreground">
									{highlights.map((highlight) => (
										<li key={highlight} className="max-w-xl">
											{highlight}
										</li>
									))}
								</ul>
							</div>
						</li>
					))}
				</ol>
			</div>
		</Section>
	);
}
