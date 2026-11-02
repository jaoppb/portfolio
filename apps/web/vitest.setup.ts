import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

declare module "vitest" {
	interface Matchers<R, T> {
		toHaveNoViolations(): R;
	}
	interface AsymmetricMatchersContaining {
		toHaveNoViolations(): void;
	}
}

vi.mock("next/font/local", () => ({
	default: () => ({
		className: "mock-font",
		variable: "--font-mock",
	}),
}));
