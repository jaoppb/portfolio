import localFont from "next/font/local";

export const fontSans = localFont({
	src: "../assets/fonts/AdwaitaSans-Regular.ttf",
	variable: "--font-sans",
	display: "swap",
});

export const fontMono = localFont({
	src: "../assets/fonts/AdwaitaMono-Regular.ttf",
	variable: "--font-mono",
	display: "swap",
});
