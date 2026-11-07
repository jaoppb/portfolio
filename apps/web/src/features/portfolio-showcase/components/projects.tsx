import { Section } from "@/components/ui/section";
import type { Locale } from "@/shared/config/site";
import type { Dictionary } from "@/shared/dictionaries/types";
import { getProjects } from "../projects";
import { ProjectCard } from "./project-card";

export interface ProjectsProps {
	locale: Locale;
	projects: Dictionary["projects"];
	newTabLabel: string;
}

export function Projects({ locale, projects, newTabLabel }: ProjectsProps) {
	const labels = {
		repository: projects.repository,
		liveDemo: projects.liveDemo,
		newTab: newTabLabel,
	};

	return (
		<Section id="projects" labelledBy="projects-title" rule>
			<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
				<div className="flex flex-col gap-3">
					<h2
						id="projects-title"
						className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
					>
						{projects.title}
					</h2>
					<p className="max-w-xl text-base text-muted">{projects.lead}</p>
				</div>
				<ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{getProjects(locale).map((project) => (
						<ProjectCard key={project.slug} project={project} labels={labels} />
					))}
				</ul>
			</div>
		</Section>
	);
}
