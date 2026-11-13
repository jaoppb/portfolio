import { describe, expect, it } from "vitest";
import { formatMonth } from "./format-month";

describe("formatMonth", () => {
	it("formats an ISO month with the locale's short month and year", () => {
		expect(formatMonth("2026-07", "en")).toBe("Jul 2026");
		expect(formatMonth("2025-10", "pt")).toMatch(/^out\.? (de )?2025$/);
	});

	it("does not shift to the previous month in negative UTC offsets", () => {
		const original = process.env.TZ;
		process.env.TZ = "America/Sao_Paulo";
		try {
			expect(formatMonth("2026-01", "en")).toBe("Jan 2026");
		} finally {
			process.env.TZ = original;
		}
	});
});
