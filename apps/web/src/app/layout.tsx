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
			<body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
				<div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 sm:px-8">
					<header className="flex items-center justify-between border-b border-[var(--border)] pb-6">
						<div>
							<h1 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
								João Pedro
							</h1>
							<p className="font-mono text-xs text-[var(--muted)]">
								Software Engineer
							</p>
						</div>
						<nav aria-label="Main Navigation">
							<ul className="flex items-center gap-6 text-sm">
								<li>
									<a
										href="#overview"
										className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
									>
										Overview
									</a>
								</li>
								<li>
									<a
										href="#architecture"
										className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
									>
										Architecture
									</a>
								</li>
							</ul>
						</nav>
					</header>

					<div className="flex-1 py-10">{children}</div>

					<footer className="border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<p>© 2026 João Pedro. All rights reserved.</p>
							<p className="font-mono text-[11px] tabular-nums">
								Milestone v0.1.0 · Walking Skeleton
							</p>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
