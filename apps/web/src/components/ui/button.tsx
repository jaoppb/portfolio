import { cn } from "@/shared/utils/cn";

/** Options of the Figma `Button` component; applied to links, since every action navigates. */
interface ButtonStyleOptions {
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
}

const variantStyles: Record<NonNullable<ButtonStyleOptions["variant"]>, string> = {
	primary: "bg-accent text-accent-foreground hover:opacity-90 active:opacity-100",
	secondary: "bg-muted-bg text-foreground hover:bg-border active:opacity-90",
	outline:
		"border border-border-strong bg-transparent text-foreground hover:bg-muted-bg active:opacity-90",
	ghost: "bg-transparent text-foreground hover:bg-muted-bg active:opacity-90",
};

const sizeStyles: Record<NonNullable<ButtonStyleOptions["size"]>, string> = {
	sm: "h-8 px-3 text-xs",
	md: "h-10 px-4 text-sm",
	lg: "h-12 px-6 text-base",
};

export function buttonStyles({
	variant = "primary",
	size = "md",
	className,
}: ButtonStyleOptions = {}) {
	return cn(
		"inline-flex items-center justify-center font-medium rounded-sm select-none",
		"transition-colors duration-(--duration-base) ease-standard focus-ring",
		variantStyles[variant],
		sizeStyles[size],
		className,
	);
}
