import { renderButton } from "@/components/ui/button";
import { formatDate } from "@/shared/utils/format";

export interface ContactMessage {
	message: string;
}

export function submitContactForm(msg: ContactMessage): string {
	const time = formatDate(new Date());
	return `${time}: Sent ${msg.message}`;
}

export function renderContactForm(): string {
	return renderButton({ label: "Send Message", onClick: () => {} });
}
