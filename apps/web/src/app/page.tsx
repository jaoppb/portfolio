import { SystemStatus } from "@/features/system-status/components/system-status";

export default function HomePage() {
	return (
		<main id="overview" className="flex flex-col gap-10">
			<section aria-labelledby="hero-title" className="space-y-4">
				<h2
					id="hero-title"
					className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
				>
					Engineering robust, verifiable systems.
				</h2>
				<p className="max-w-2xl text-base leading-relaxed text-muted">
					Personal portfolio and project showcase. Built with Next.js App Router, pure
					static export architecture, and strict accessibility standards.
				</p>
			</section>

			<section id="architecture">
				<SystemStatus />
			</section>
		</main>
	);
}
