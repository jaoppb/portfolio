import { buttonStyles } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface HeroProps {
	hero: Dictionary["hero"];
}

export function Hero({ hero }: HeroProps) {
	return (
		<Section id="hero" labelledBy="hero-title">
			<div className="flex flex-col items-start gap-6">
				<p className="font-mono text-sm text-muted">{hero.role}</p>
				<h1
					id="hero-title"
					className="max-w-[700px] text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:max-w-[800px] lg:text-5xl"
				>
					{hero.headline}
				</h1>
				<p className="max-w-xl text-lg text-muted">{hero.intro}</p>
				<div className="flex flex-wrap gap-3">
					<a href="#projects" className={buttonStyles({ variant: "primary" })}>
						{hero.ctaProjects}
					</a>
					<a href="#contact" className={buttonStyles({ variant: "outline" })}>
						{hero.ctaContact}
					</a>
				</div>
			</div>
		</Section>
	);
}
