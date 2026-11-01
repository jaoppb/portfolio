import { renderButton } from "@/components/ui/button";
import { formatDate } from "../../shared/utils/format";

export function renderPortfolio(): string {
	const formatted = formatDate(new Date());
	const button = renderButton({ label: "View Project", onClick: () => {} });
	return `<div>${formatted}: ${button}</div>`;
}
