import type * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface SkipLinkProps {
	href?: string;
	children: React.ReactNode;
	className?: string;
}

export function SkipLink({ href = "#main-content", children, className }: SkipLinkProps) {
	return (
		<a
			href={href}
			className={cn(
				"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
				"focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground",
				"focus:shadow-md focus:outline-none focus:ring-2 focus:ring-foreground",
				className,
			)}
		>
			{children}
		</a>
	);
}
