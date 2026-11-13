import type * as React from "react";
import { fontMono, fontSans } from "@/app/fonts";
import "@/app/globals.css";
import type { Locale } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

/** The `<html>` and `<body>` of every localized page, with the global stylesheet. */
export function LocaleDocument({
	locale,
	children,
}: {
	locale: Locale;
	children: React.ReactNode;
}) {
	return (
		<html lang={locale} className={cn(fontSans.variable, fontMono.variable)}>
			<body className="min-h-screen bg-background text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}
