import { describe, expect, it } from "vitest";
import { buttonStyles } from "./button";

describe("buttonStyles", () => {
	it("returns primary md styles by default", () => {
		const classes = buttonStyles();
		expect(classes).toContain("bg-accent");
		expect(classes).toContain("h-10");
		expect(classes).toContain("focus-ring");
	});

	it("supports the outline variant and merges extra classes", () => {
		const classes = buttonStyles({ variant: "outline", className: "w-full" });
		expect(classes).toContain("border-border-strong");
		expect(classes).toContain("w-full");
		expect(classes).not.toContain("bg-accent");
	});
});
