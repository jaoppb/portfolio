import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button component", () => {
	it("renders button with children and default attributes", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("type", "button");
	});

	it("handles click events", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Clickable</Button>);
		const button = screen.getByRole("button", { name: /clickable/i });
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("disables the button when disabled prop is provided", () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>,
		);
		const button = screen.getByRole("button", { name: /disabled/i });
		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("applies variant styling classes", () => {
		render(<Button variant="outline">Outline</Button>);
		const button = screen.getByRole("button", { name: /outline/i });
		expect(button).toHaveClass("border");
	});
});
