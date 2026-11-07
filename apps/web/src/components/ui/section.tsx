import type * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	id: string;
	/** Id of the heading that names the section; omit for unlabelled wrappers. */
	labelledBy?: string;
	/** Draw the 1px top rule that separates a section from the one above. */
	rule?: boolean;
}

export function Section({ id, labelledBy, rule, className, children, ...props }: SectionProps) {
	return (
		<section
			{...props}
			id={id}
			aria-labelledby={labelledBy}
			className={cn(
				"scroll-mt-4 py-16 md:py-20 lg:py-24",
				rule && "border-t border-border",
				className,
			)}
		>
			{children}
		</section>
	);
}
