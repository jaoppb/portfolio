const DEV_FALLBACK_URL = "http://localhost:3000";

export interface SiteUrlEnv {
	NEXT_PUBLIC_SITE_URL?: string;
	NEXT_PUBLIC_ROBOTS_NOINDEX?: string;
	CI?: string;
	NODE_ENV?: string;
}

/**
 * Resolves the public origin used for canonical, hreflang, sitemap and robots URLs.
 * No domain is hardcoded: the production value is provided by the deploy (#47).
 * An unset value falls back to localhost for local work and throws in CI/production
 * builds so a missing variable can never ship localhost URLs.
 */
export function resolveSiteUrl(env: SiteUrlEnv): string {
	const raw = env.NEXT_PUBLIC_SITE_URL?.trim();

	if (!raw) {
		if (env.CI && env.NODE_ENV === "production") {
			throw new Error("NEXT_PUBLIC_SITE_URL must be set for CI and production builds.");
		}
		return DEV_FALLBACK_URL;
	}

	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid absolute URL: "${raw}".`);
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		throw new Error(`NEXT_PUBLIC_SITE_URL must use http or https: "${raw}".`);
	}

	return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

/** Preview deploys set `NEXT_PUBLIC_ROBOTS_NOINDEX=1` so they are never indexed. */
export function isNoindex(env: SiteUrlEnv): boolean {
	return env.NEXT_PUBLIC_ROBOTS_NOINDEX === "1";
}
