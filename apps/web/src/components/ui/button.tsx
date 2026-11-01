import type * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
	primary:
		"bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 active:opacity-100",
	secondary:
		"bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-[var(--border)] active:opacity-90",
	outline:
		"border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted-bg)] active:opacity-90",
	ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted-bg)] active:opacity-90",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
	sm: "h-8 px-3 text-xs",
	md: "h-10 px-4 text-sm",
	lg: "h-12 px-6 text-base",
};

export function Button({
	children,
	className,
	variant = "primary",
	size = "md",
	disabled,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={cn(
				"inline-flex items-center justify-center font-medium rounded-sm select-none",
				"transition-colors duration-150 ease-out",
				"motion-reduce:transition-none",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
				"disabled:pointer-events-none disabled:opacity-50",
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
