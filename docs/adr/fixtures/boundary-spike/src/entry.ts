import { renderContactForm } from "./features/contact-form/index";
import { cycleStepA } from "./features/portfolio-showcase/cycle-a";
import { crossFeatureViolationCall } from "./features/portfolio-showcase/illegal-cross-feature";
import { renderPortfolio } from "./features/portfolio-showcase/index";

export function main(): void {
	renderPortfolio();
	renderContactForm();
	crossFeatureViolationCall();
	cycleStepA();
}
