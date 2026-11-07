import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface AboutProps {
	about: Dictionary["about"];
}

export function About({ about }: AboutProps) {
	return (
		<Section id="about" labelledBy="about-title" rule>
			<div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:gap-16">
				<h2
					id="about-title"
					className="text-2xl font-bold tracking-tight text-foreground lg:w-80 lg:shrink-0 lg:text-3xl"
				>
					{about.title}
				</h2>
				<div className="flex min-w-0 flex-col gap-4 text-base text-foreground">
					<p className="max-w-xl">{about.p1}</p>
					<p className="max-w-xl">{about.p2}</p>
				</div>
			</div>
		</Section>
	);
}
