import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface SkillsProps {
	skills: Dictionary["skills"];
}

export function Skills({ skills }: SkillsProps) {
	return (
		<Section id="skills" labelledBy="skills-title" rule>
			<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
				<h2
					id="skills-title"
					className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
				>
					{skills.title}
				</h2>
				<div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
					{skills.groups.map(({ label, items }, index) => (
						<div
							key={label}
							className="flex min-w-0 flex-col gap-2 border-t border-border py-4"
						>
							<h3
								id={`skills-group-${index}`}
								className="font-mono text-xs text-muted"
							>
								{label}
							</h3>
							<ul
								aria-labelledby={`skills-group-${index}`}
								className="text-sm text-foreground"
							>
								{items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}
