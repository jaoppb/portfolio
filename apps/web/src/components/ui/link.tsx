import type * as React from "react";
import { cn } from "@/shared/utils/cn";

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">;

export type LinkProps = AnchorProps &
	({ external?: false; newTabLabel?: never } | { external: true; newTabLabel: string });

export function Link({ children, className, external, newTabLabel, ...props }: LinkProps) {
	return (
		<a
			{...props}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			className={cn(
				"rounded-sm px-1 font-medium text-accent underline underline-offset-4",
				"transition-colors duration-(--duration-base) ease-standard hover:text-foreground focus-ring",
				className,
			)}
		>
			{children}
			{external ? (
				<>
					{" "}
					<span className="sr-only">{newTabLabel}</span>
				</>
			) : null}
		</a>
	);
}
