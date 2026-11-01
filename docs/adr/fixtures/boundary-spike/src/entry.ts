import {
	type ContactMessage,
	renderContactForm,
	submitContactForm,
} from "./features/contact-form/index";
import { renderPortfolio } from "./features/portfolio-showcase/index";

export function main(): void {
	renderPortfolio();
	renderContactForm();
	const msg: ContactMessage = { message: "Inquiry" };
	submitContactForm(msg);
}
