import type * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
	tone?: "neutral" | "accent" | "destructive";
}

const toneStyles: Record<NonNullable<TagProps["tone"]>, string> = {
	neutral: "text-muted",
	accent: "text-accent",
	destructive: "text-destructive",
};

/** Outline label for critical status and git tags only; never decorative. */
export function Tag({ children, className, tone = "neutral", ...props }: TagProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-sm border border-current px-2 py-0.5 font-mono text-2xs uppercase",
				toneStyles[tone],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
