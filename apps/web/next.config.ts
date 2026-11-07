import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	// Defaults to `out`; the export tests build into their own directories.
	distDir: process.env.NEXT_EXPORT_DIR || undefined,
	images: {
		unoptimized: true,
	},
	reactStrictMode: true,
};

export default nextConfig;
