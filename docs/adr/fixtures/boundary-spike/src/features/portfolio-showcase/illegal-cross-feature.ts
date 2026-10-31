/**
 * Deliberate architectural boundary violation:
 * features/portfolio-showcase must NOT import sibling feature features/contact-form.
 */
import { submitContactForm } from "../contact-form/index";

export function crossFeatureViolationCall(): string {
	return submitContactForm({ message: "illegal cross-feature call" });
}
