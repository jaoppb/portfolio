import { type Locale, siteConfig } from "@/shared/config/site";
import { enDictionary } from "./en";
import { ptDictionary } from "./pt";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = {
	en: enDictionary,
	pt: ptDictionary,
};

export function isValidLocale(lang: string): lang is Locale {
	return siteConfig.locales.includes(lang as Locale);
}

/** Locale of a `[lang]` route segment; anything unknown falls back to the default locale. */
export function resolveLocale(lang: string): Locale {
	return isValidLocale(lang) ? lang : siteConfig.defaultLocale;
}

export async function getDictionary(lang: string): Promise<Dictionary> {
	return dictionaries[resolveLocale(lang)];
}

export type { Dictionary };
