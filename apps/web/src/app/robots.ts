import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	if (siteConfig.noindex) {
		return { rules: { userAgent: "*", disallow: "/" } };
	}
	return {
		rules: { userAgent: "*", allow: "/" },
		sitemap: `${siteConfig.url}/sitemap.xml`,
	};
}
