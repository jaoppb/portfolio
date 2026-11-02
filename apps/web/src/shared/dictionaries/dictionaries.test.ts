import { describe, expect, it } from "vitest";
import { siteConfig } from "@/shared/config/site";
import { enDictionary } from "./en";
import { getDictionary, isValidLocale } from "./index";
import { ptDictionary } from "./pt";

describe("Dictionaries", () => {
	it("maintains 1:1 key parity and structure between English and Portuguese", () => {
		function getDeepKeys(obj: Record<string, unknown>, prefix = ""): string[] {
			let keys: string[] = [];
			for (const [key, value] of Object.entries(obj)) {
				const fullKey = prefix ? `${prefix}.${key}` : key;
				if (value !== null && typeof value === "object" && !Array.isArray(value)) {
					keys = keys.concat(getDeepKeys(value as Record<string, unknown>, fullKey));
				} else {
					keys.push(fullKey);
				}
			}
			return keys.sort();
		}

		const enKeys = getDeepKeys(enDictionary as unknown as Record<string, unknown>);
		const ptKeys = getDeepKeys(ptDictionary as unknown as Record<string, unknown>);

		expect(enKeys).toEqual(ptKeys);
	});

	it("contains no empty strings in translations", () => {
		function assertNonEmpty(obj: Record<string, unknown>, path = ""): void {
			for (const [key, value] of Object.entries(obj)) {
				const currentPath = path ? `${path}.${key}` : key;
				if (typeof value === "string") {
					expect(
						value.trim().length,
						`Key ${currentPath} must not be empty`,
					).toBeGreaterThan(0);
				} else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
					assertNonEmpty(value as Record<string, unknown>, currentPath);
				}
			}
		}

		assertNonEmpty(enDictionary as unknown as Record<string, unknown>, "en");
		assertNonEmpty(ptDictionary as unknown as Record<string, unknown>, "pt");
	});

	it("correctly identifies valid and invalid locales", () => {
		expect(isValidLocale("en")).toBe(true);
		expect(isValidLocale("pt")).toBe(true);
		expect(isValidLocale("es")).toBe(false);
		expect(isValidLocale("fr")).toBe(false);
		expect(isValidLocale("")).toBe(false);
	});

	it("returns corresponding dictionary for valid locale and defaults for invalid", async () => {
		const en = await getDictionary("en");
		expect(en.meta.title).toBe(enDictionary.meta.title);

		const pt = await getDictionary("pt");
		expect(pt.meta.title).toBe(ptDictionary.meta.title);

		const fallback = await getDictionary("invalid-locale");
		expect(fallback.meta.title).toBe(
			siteConfig.defaultLocale === "en" ? enDictionary.meta.title : ptDictionary.meta.title,
		);
	});
});
