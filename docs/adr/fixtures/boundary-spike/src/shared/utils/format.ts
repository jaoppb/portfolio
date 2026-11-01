export function formatDate(d: Date): string {
	return d.toISOString();
}

/**
 * Deliberate unused dead export to test fallow dead-code detection.
 */
export function unusedDeadHelper(): string {
	return "dead";
}
