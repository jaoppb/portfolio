export function formatDate(d: Date): string {
	return d.toISOString();
}

/**
 * Deliberate unused dead export to test fallow dead-code detection.
 * Uncomment to verify `pnpm exec fallow dead-code` flags unused export.
 */
// export function unusedDeadHelper(): string {
// 	return "dead";
// }
