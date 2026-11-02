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

export async function getDictionary(lang: string): Promise<Dictionary> {
	if (isValidLocale(lang)) {
		return dictionaries[lang];
	}
	return dictionaries[siteConfig.defaultLocale];
}

export type { Dictionary };
