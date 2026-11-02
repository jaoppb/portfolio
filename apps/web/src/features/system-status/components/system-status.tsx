import { Button } from "@/components/ui/button";

export interface SystemStatusLabels {
	title?: string;
	description?: string;
	operational?: string;
	target?: string;
	framework?: string;
	milestone?: string;
	documentation?: string;
	sourceSpecs?: string;
}

export interface SystemStatusProps {
	version?: string;
	framework?: string;
	target?: string;
	labels?: SystemStatusLabels;
}

export function SystemStatus({
	version = "0.1.0",
	framework = "Next.js 16",
	target = "Cloudflare Pages (output: export)",
	labels,
}: SystemStatusProps) {
	const title = labels?.title ?? "Architecture & Skeleton Status";
	const description =
		labels?.description ??
		"Pure static export configuration and feature-first boundary verification.";
	const operational = labels?.operational ?? "Operational";
	const targetLabel = labels?.target ?? "Target";
	const frameworkLabel = labels?.framework ?? "Framework";
	const milestoneLabel = labels?.milestone ?? "Milestone";
	const documentation = labels?.documentation ?? "Documentation";
	const sourceSpecs = labels?.sourceSpecs ?? "Source Specs";

	return (
		<section
			aria-labelledby="system-status-heading"
			className="rounded-md border border-border bg-background p-6"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2
						id="system-status-heading"
						className="text-base font-semibold tracking-tight text-foreground"
					>
						{title}
					</h2>
					<p className="mt-1 text-sm text-muted">{description}</p>
				</div>
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className="inline-block h-2 w-2 rounded-full bg-emerald-500"
					/>
					<span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
						{operational}
					</span>
				</div>
			</div>

			<dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{targetLabel}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						{target}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{frameworkLabel}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						{framework}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{milestoneLabel}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						v{version}
					</dd>
				</div>
			</dl>

			<div className="mt-6 flex items-center gap-3">
				<Button variant="secondary" size="sm">
					{documentation}
				</Button>
				<Button variant="outline" size="sm">
					{sourceSpecs}
				</Button>
			</div>
		</section>
	);
}
