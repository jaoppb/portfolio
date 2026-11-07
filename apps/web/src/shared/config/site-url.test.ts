import { describe, expect, it } from "vitest";
import { isNoindex, resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
	it("returns the origin without a trailing slash", () => {
		expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/" })).toBe(
			"https://example.com",
		);
		expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: " https://example.com/base// " })).toBe(
			"https://example.com/base",
		);
	});

	it("falls back to localhost when unset outside CI production builds", () => {
		expect(resolveSiteUrl({})).toBe("http://localhost:3000");
		expect(resolveSiteUrl({ NODE_ENV: "production" })).toBe("http://localhost:3000");
		expect(resolveSiteUrl({ CI: "true", NODE_ENV: "test" })).toBe("http://localhost:3000");
		expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "  " })).toBe("http://localhost:3000");
	});

	it("throws when unset in a CI production build", () => {
		expect(() => resolveSiteUrl({ CI: "true", NODE_ENV: "production" })).toThrow(
			/NEXT_PUBLIC_SITE_URL must be set/,
		);
	});

	it("throws on values that are not absolute http(s) URLs", () => {
		expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "example.com" })).toThrow(
			/not a valid/,
		);
		expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "ftp://example.com" })).toThrow(
			/http or https/,
		);
	});
});

describe("isNoindex", () => {
	it("is true only for the value 1", () => {
		expect(isNoindex({ NEXT_PUBLIC_ROBOTS_NOINDEX: "1" })).toBe(true);
		expect(isNoindex({ NEXT_PUBLIC_ROBOTS_NOINDEX: "0" })).toBe(false);
		expect(isNoindex({})).toBe(false);
	});
});
