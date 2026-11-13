import type * as React from "react";
import { fontMono, fontSans } from "@/app/fonts";
import type { Locale } from "@/shared/config/site";
import { cn } from "@/shared/utils/cn";

/** The `<html>` and `<body>` of every localized page; import `globals.css` next to it. */
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
