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

// next/font is compiled away by Next.js; stub it so modules importing fonts load under Vitest.
const mockFont = () => ({ className: "mock-font", variable: "--font-mock" });

vi.mock("next/font/google", () => ({ Inter: mockFont, JetBrains_Mono: mockFont }));
