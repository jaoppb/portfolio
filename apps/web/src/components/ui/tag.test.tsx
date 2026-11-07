import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./tag";

describe("Tag component", () => {
	it("renders its children as a mono, outlined, non-pill label", () => {
		render(<Tag>v0.1.0</Tag>);
		const tag = screen.getByText("v0.1.0");
		expect(tag).toHaveClass("font-mono", "border", "border-current", "rounded-sm");
		expect(tag).not.toHaveClass("rounded-full");
	});

	it("defaults to the neutral tone", () => {
		render(<Tag>neutral</Tag>);
		expect(screen.getByText("neutral")).toHaveClass("text-muted");
	});

	it.each([
		["accent", "text-accent"],
		["destructive", "text-destructive"],
	] as const)("applies the %s tone", (tone, className) => {
		render(<Tag tone={tone}>label</Tag>);
		expect(screen.getByText("label")).toHaveClass(className);
	});

	it("merges custom class names", () => {
		render(<Tag className="custom">x</Tag>);
		expect(screen.getByText("x")).toHaveClass("custom");
	});
});
