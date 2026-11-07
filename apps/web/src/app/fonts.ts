import { Inter, JetBrains_Mono } from "next/font/google";

export const fontSans = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const fontMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
	display: "swap",
});
