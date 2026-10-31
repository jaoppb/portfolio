export interface ButtonProps {
	label: string;
	onClick: () => void;
}

export function renderButton(props: ButtonProps): string {
	return `<button>${props.label}</button>`;
}
