import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface NotFoundProps {
	notFound: Dictionary["notFound"];
	/** Home page of the locale the 404 is shown in. */
	homeHref: string;
}

export function NotFound({ notFound, homeHref }: NotFoundProps) {
	return (
		<Section id="not-found" labelledBy="not-found-title" className="md:py-24">
			<div className="flex flex-col items-start gap-6">
				<p className="font-mono text-sm text-muted">{notFound.eyebrow}</p>
				<h1
					id="not-found-title"
					className="max-w-[700px] text-balance text-4xl font-bold text-foreground md:text-5xl"
				>
					{notFound.title}
				</h1>
				<p className="max-w-xl text-lg text-muted">{notFound.message}</p>
				<Link href={homeHref} className={buttonStyles({ variant: "primary" })}>
					{notFound.home}
				</Link>
			</div>
		</Section>
	);
}
