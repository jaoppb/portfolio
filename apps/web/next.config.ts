import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	// Defaults to `out`; the export tests build into their own directories.
	distDir: process.env.NEXT_EXPORT_DIR || undefined,
	images: {
		unoptimized: true,
	},
	reactStrictMode: true,
	experimental: {
		// Lets `app/global-not-found.tsx` become the root `404.html`; `seo-export.test.ts` guards it.
		// Without the flag Next ignores that file and exports its built-in English 404 instead;
		// `/en/404.html` and `/pt/404.html` do not depend on it.
		globalNotFound: true,
	},
};

export default nextConfig;
