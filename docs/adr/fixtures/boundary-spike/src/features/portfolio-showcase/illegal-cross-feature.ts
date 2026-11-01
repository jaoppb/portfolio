// fallow-ignore-file unused-file
/**
 * Deliberate architectural boundary violation:
 * features/portfolio-showcase must NOT import sibling feature features/contact-form.
 *
 * Uncomment below to test fallow boundary enforcement:
 */
// import { submitContactForm } from "../contact-form/index";
//
// export function crossFeatureViolationCall(): string {
// 	return submitContactForm({ message: "illegal cross-feature call" });
// }
