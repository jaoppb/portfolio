import type { Dictionary } from "@/shared/dictionaries/types";

export interface NavItem {
	/** Section id the link points at; the section itself is added by #39-#42. */
	id: string;
	label: keyof Dictionary["nav"];
}

export const navItems: readonly NavItem[] = [
	{ id: "about", label: "about" },
	{ id: "projects", label: "projects" },
	{ id: "experience", label: "experience" },
	{ id: "contact", label: "contact" },
];
