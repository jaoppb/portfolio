import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(import.meta.dirname, "globals.css"), "utf8");

type Mode = "light" | "dark";
type Kind = "text" | "primary-text" | "ui";

const NEEDS: Record<Kind, number> = { text: 4.5, "primary-text": 7, ui: 3 };

function declarations(block: string): Map<string, string> {
	const map = new Map<string, string>();
	for (const match of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
		map.set(match[1] as string, (match[2] as string).trim());
	}
	return map;
}

function between(source: string, start: string, pattern?: RegExp): string {
	const from = pattern ? source.search(pattern) : source.indexOf(start);
	if (from === -1) throw new Error(`globals.css is missing "${start}"`);
	const open = source.indexOf("{", from);
	let depth = 0;
	for (let i = open; i < source.length; i++) {
		if (source[i] === "{") depth++;
		if (source[i] === "}") depth--;
		if (depth === 0) return source.slice(open + 1, i);
	}
	throw new Error(`globals.css has an unbalanced block after "${start}"`);
}

const primitives = declarations(between(css, ":root", /^\s*:root\s*\{/m));
const light = declarations(between(css, "@theme static"));
const dark = declarations(between(css, "@media (prefers-color-scheme: dark)"));

function resolve(role: string, mode: Mode): string {
	const value = (mode === "dark" ? dark : light).get(role);
	if (!value) throw new Error(`No ${mode} value for --${role}`);
	const alias = /^var\(--([a-z0-9-]+)\)$/.exec(value);
	if (!alias) return value;
	const hex = primitives.get(alias[1] as string);
	if (!hex) throw new Error(`--${role} aliases unknown primitive --${alias[1]}`);
	return hex;
}

function luminance(hex: string): number {
	const channels = [1, 3, 5].map((i) => {
		const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return (
		0.2126 * (channels[0] as number) +
		0.7152 * (channels[1] as number) +
		0.0722 * (channels[2] as number)
	);
}

function ratio(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return ((hi as number) + 0.05) / ((lo as number) + 0.05);
}

// Pairs from docs/design/figma-foundations.md (Contrast section).
const PAIRS: ReadonlyArray<[string, string, Kind]> = [
	["color-foreground", "color-background", "primary-text"],
	["color-foreground", "color-surface", "primary-text"],
	["color-foreground", "color-muted-bg", "primary-text"],
	["color-foreground", "color-border", "text"],
	["color-muted", "color-background", "text"],
	["color-muted", "color-surface", "text"],
	["color-muted", "color-muted-bg", "text"],
	["color-accent", "color-background", "text"],
	["color-accent", "color-surface", "text"],
	["color-accent", "color-muted-bg", "text"],
	["color-accent-foreground", "color-accent", "text"],
	["color-destructive", "color-background", "text"],
	["color-destructive", "color-surface", "text"],
	["color-destructive", "color-muted-bg", "text"],
	["color-border-strong", "color-background", "ui"],
	["color-border-strong", "color-surface", "ui"],
	["color-border-strong", "color-muted-bg", "ui"],
	["color-focus-ring", "color-background", "ui"],
	["color-focus-ring", "color-surface", "ui"],
	["color-focus-ring", "color-muted-bg", "ui"],
	["color-accent", "color-background", "ui"],
];

describe("design token contrast (WCAG 2.x)", () => {
	for (const mode of ["light", "dark"] as const) {
		describe(mode, () => {
			it.each(PAIRS)("%s on %s meets its %s threshold", (fg, bg, kind) => {
				expect(ratio(resolve(fg, mode), resolve(bg, mode))).toBeGreaterThanOrEqual(
					NEEDS[kind],
				);
			});
		});
	}

	it("matches a published ratio from the foundations doc", () => {
		expect(
			ratio(resolve("color-foreground", "light"), resolve("color-background", "light")),
		).toBeCloseTo(18.17, 1);
	});
});
