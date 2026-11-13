import { Link } from "@/components/ui/link";
import type { Project } from "../projects";

export interface ProjectCardLabels {
	repository: string;
	liveDemo: string;
	newTab: string;
}

export interface ProjectCardProps {
	project: Project;
	labels: ProjectCardLabels;
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
	const { title, summary, year, tech, links } = project;
	const linkItems = [
		{ href: links.repository, label: labels.repository },
		...(links.demo ? [{ href: links.demo, label: labels.liveDemo }] : []),
	];

	return (
		<li className="flex">
			<article className="@container flex w-full min-w-0 flex-col gap-4 rounded-sm border border-border bg-surface p-6 transition-colors duration-(--duration-base) ease-standard hover:border-border-strong">
				<div className="flex flex-1 flex-col gap-2">
					<div className="flex items-baseline justify-between gap-4">
						<h3 className="min-w-0 text-lg font-medium tracking-tight text-foreground">
							{title}
						</h3>
						<p className="shrink-0 font-mono text-xs tabular-nums text-muted">{year}</p>
					</div>
					<p className="text-sm text-muted">{summary}</p>
				</div>
				<div className="flex flex-col gap-2 border-t border-border pt-4 @md:flex-row @md:items-center @md:justify-between @md:gap-4">
					<p className="min-w-0 font-mono text-xs text-muted @md:flex-1">
						{tech.join(" · ")}
					</p>
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
						{linkItems.map(({ href, label }) => (
							<Link
								key={href}
								href={href}
								external
								newTabLabel={labels.newTab}
								className="pl-0"
							>
								{label} <span aria-hidden="true">↗</span>
								<span className="sr-only">, {title}</span>
							</Link>
						))}
					</div>
				</div>
			</article>
		</li>
	);
}
