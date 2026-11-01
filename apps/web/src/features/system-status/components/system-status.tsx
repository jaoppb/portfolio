import { Button } from "@/components/ui/button";

export interface SystemStatusProps {
	version?: string;
	framework?: string;
	target?: string;
}

export function SystemStatus({
	version = "0.1.0",
	framework = "Next.js 16",
	target = "Cloudflare Pages (output: export)",
}: SystemStatusProps) {
	return (
		<section
			aria-labelledby="system-status-heading"
			className="rounded-md border border-[var(--border)] bg-[var(--background)] p-6"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2
						id="system-status-heading"
						className="text-base font-semibold tracking-tight text-[var(--foreground)]"
					>
						Architecture & Skeleton Status
					</h2>
					<p className="mt-1 text-sm text-[var(--muted)]">
						Pure static export configuration and feature-first boundary verification.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className="inline-block h-2 w-2 rounded-full bg-emerald-500"
					/>
					<span className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--foreground)]">
						Operational
					</span>
				</div>
			</div>

			<dl className="mt-6 grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
						Target
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-[var(--foreground)]">
						{target}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
						Framework
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-[var(--foreground)]">
						{framework}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
						Milestone
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-[var(--foreground)]">
						v{version}
					</dd>
				</div>
			</dl>

			<div className="mt-6 flex items-center gap-3">
				<Button variant="secondary" size="sm">
					Documentation
				</Button>
				<Button variant="outline" size="sm">
					Source Specs
				</Button>
			</div>
		</section>
	);
}
