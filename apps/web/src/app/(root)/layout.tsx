import type { Metadata } from "next";
import type * as React from "react";
import "@/app/globals.css";
import { robotsMetadata, siteConfig } from "@/shared/config/site";

export const metadata: Metadata = {
	title: `${siteConfig.name} — Software Engineer`,
	description: "Redirecting to /en...",
	metadataBase: new URL(siteConfig.url),
	robots: robotsMetadata,
	alternates: {
		canonical: `${siteConfig.url}/en`,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta httpEquiv="refresh" content="0; url=/en" />
			</head>
			<body className="bg-background text-foreground antialiased">{children}</body>
		</html>
	);
}
