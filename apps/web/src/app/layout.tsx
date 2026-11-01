import type { Metadata } from "next";
import type * as React from "react";
import { fontMono, fontSans } from "./fonts";
import "./globals.css";
import { cn } from "@/shared/utils/cn";

export const metadata: Metadata = {
	title: "João Pedro — Software Engineer",
	description:
		"Personal portfolio and engineering showcase by João Pedro. Built with Next.js static export.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={cn(fontSans.variable, fontMono.variable)}>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 sm:px-8">
					<header className="flex items-center justify-between border-b border-border pb-6">
						<div>
							<h1 className="text-lg font-semibold tracking-tight text-foreground">
								João Pedro
							</h1>
							<p className="font-mono text-xs text-muted">Software Engineer</p>
						</div>
						<nav aria-label="Main Navigation">
							<ul className="flex items-center gap-6 text-sm">
								<li>
									<a
										href="#overview"
										className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
									>
										Overview
									</a>
								</li>
								<li>
									<a
										href="#architecture"
										className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
									>
										Architecture
									</a>
								</li>
							</ul>
						</nav>
					</header>

					<div className="flex-1 py-10">{children}</div>

					<footer className="border-t border-border pt-6 text-xs text-muted">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<p>© 2026 João Pedro. All rights reserved.</p>
							<p className="font-mono text-2xs tabular-nums">
								Milestone v0.1.0 · Walking Skeleton
							</p>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
