import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";
import { getDictionary } from "@/shared/dictionaries";

export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const dict = await getDictionary(siteConfig.defaultLocale);
	return {
		name: dict.meta.siteName,
		short_name: siteConfig.name,
		description: dict.meta.description,
		start_url: `/${siteConfig.defaultLocale}`,
		display: "standalone",
		// neutral-950, the icon tile and the dark background token
		background_color: "#0c0e13",
		theme_color: "#0c0e13",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
