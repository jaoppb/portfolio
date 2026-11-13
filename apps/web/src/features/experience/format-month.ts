import type { Locale } from "@/shared/config/site";

const intlLocale: Record<Locale, string> = { en: "en-US", pt: "pt-BR" };

/**
 * Formats an ISO month (`YYYY-MM`) as a short month and year. Pinned to UTC and an
 * explicit locale so the static export is identical on any build machine.
 */
export function formatMonth(isoMonth: string, locale: Locale): string {
	return new Intl.DateTimeFormat(intlLocale[locale], {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${isoMonth}-01T00:00:00Z`));
}
