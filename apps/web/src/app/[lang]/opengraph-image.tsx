import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/shared/config/site";
import { getDictionary, isValidLocale } from "@/shared/dictionaries";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

// Inter (SIL OFL 1.1), see src/features/seo/assets/OFL.txt.
const assets = path.join(process.cwd(), "src/features/seo/assets");
const loadFont = (file: string) => readFile(path.join(assets, file));

// Foundation tokens (docs/design/figma-foundations.md), dark mode:
// background neutral-950, foreground neutral-50, muted neutral-300, accent blue-300.
const colors = {
	background: "#0c0e13",
	foreground: "#f7f8fa",
	muted: "#c5cad3",
	accent: "#93bbfd",
};

export async function generateStaticParams() {
	return siteConfig.locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	const locale = isValidLocale(lang) ? lang : siteConfig.defaultLocale;
	const dict = await getDictionary(locale);
	const [regular, semibold] = await Promise.all([
		loadFont("inter-latin-400-normal.woff"),
		loadFont("inter-latin-600-normal.woff"),
	]);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				padding: 80,
				background: colors.background,
				fontFamily: "Inter",
			}}
		>
			<div
				style={{
					width: 64,
					height: 6,
					background: colors.accent,
					marginBottom: 40,
					display: "flex",
				}}
			/>
			<div
				style={{
					display: "flex",
					fontSize: 104,
					fontWeight: 600,
					lineHeight: 1.05,
					letterSpacing: "-0.03em",
					color: colors.foreground,
				}}
			>
				{dict.hero.name}
			</div>
			<div
				style={{
					display: "flex",
					marginTop: 24,
					fontSize: 44,
					fontWeight: 400,
					color: colors.muted,
				}}
			>
				{dict.hero.role}
			</div>
		</div>,
		{
			...size,
			fonts: [
				{ name: "Inter", data: regular, weight: 400, style: "normal" },
				{ name: "Inter", data: semibold, weight: 600, style: "normal" },
			],
		},
	);
}
