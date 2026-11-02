import Link from "next/link";

export default function RootPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6 text-center">
			<p className="text-sm text-muted">
				Redirecting to{" "}
				<Link
					href="/en"
					className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
				>
					/en
				</Link>
				...
			</p>
		</main>
	);
}
