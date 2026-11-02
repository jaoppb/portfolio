import { Button } from "@/components/ui/button";
import { enDictionary } from "@/shared/dictionaries/en";
import type { Dictionary } from "@/shared/dictionaries/types";

export interface SystemStatusProps {
	version?: string;
	status?: Dictionary["systemStatus"];
}

export function SystemStatus({
	version = "0.1.0",
	status = enDictionary.systemStatus,
}: SystemStatusProps) {
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
						{status.title}
					</h2>
					<p className="mt-1 text-sm text-muted">{status.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className="inline-block h-2 w-2 rounded-full bg-emerald-500"
					/>
					<span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
						{status.operational}
					</span>
				</div>
			</div>

			<dl className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{status.target}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						{status.targetValue}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{status.framework}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						{status.frameworkValue}
					</dd>
				</div>
				<div>
					<dt className="text-xs font-medium uppercase tracking-wider text-muted">
						{status.milestone}
					</dt>
					<dd className="mt-1 font-mono text-sm tabular-nums text-foreground">
						v{version}
					</dd>
				</div>
			</dl>

			<div className="mt-6 flex items-center gap-3">
				<Button variant="secondary" size="sm">
					{status.documentation}
				</Button>
				<Button variant="outline" size="sm">
					{status.sourceSpecs}
				</Button>
			</div>
		</section>
	);
}
