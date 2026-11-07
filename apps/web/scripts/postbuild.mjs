import { rm } from "node:fs/promises";
import path from "node:path";

// Preview deploys (NEXT_PUBLIC_ROBOTS_NOINDEX=1) must not publish a sitemap.
// Next always emits the sitemap.xml metadata route, so drop it from the export.
if (process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === "1") {
	const outDir = process.env.NEXT_EXPORT_DIR || "out";
	await rm(path.join(outDir, "sitemap.xml"), { force: true });
}
