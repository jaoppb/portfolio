import type { Locale } from "@/shared/config/site";

type Localized = Record<Locale, string>;

interface ProjectDefinition {
	slug: string;
	title: string;
	summary: Localized;
	year: number;
	tech: readonly string[];
	repository: string;
	/** One URL for every locale, or one per locale. */
	demo?: string | Localized;
}

export interface Project {
	/** Stable id; detail pages in v0.3.0 will route on it. */
	slug: string;
	title: string;
	summary: string;
	year: number;
	tech: readonly string[];
	links: { repository: string; demo?: string };
}

const githubUser = "https://github.com/jaoppb";

/** Public URL of this site. Not live until #47 (deploy); keep it here so #47 can verify it. */
const portfolioDemo: Localized = {
	en: "https://jaoppb.com/en",
	pt: "https://jaoppb.com/pt",
};

const definitions: readonly ProjectDefinition[] = [
	{
		slug: "alloy",
		title: "Alloy",
		summary: {
			en: "A modular web browser: a Rust core with behaviour scripted in Rhai.",
			pt: "Um navegador modular: núcleo em Rust com o comportamento definido em scripts Rhai.",
		},
		year: 2026,
		tech: ["Rust", "Rhai"],
		repository: `${githubUser}/alloy`,
	},
	{
		slug: "styx",
		title: "styx",
		summary: {
			en: "A filtering DNS resolver written from scratch in Rust, meant to replace Pi-hole on a home network. In early development.",
			pt: "Um resolvedor DNS com filtragem escrito do zero em Rust, para assumir o papel do Pi-hole numa rede doméstica. Em desenvolvimento inicial.",
		},
		year: 2026,
		tech: ["Rust", "Tokio", "DNS"],
		repository: `${githubUser}/styx`,
	},
	{
		slug: "tools",
		title: "tools",
		summary: {
			en: "A monorepo of developer tools, starting with GitHub workflow management: repository settings, labels, milestones and issue rules defined in one config file.",
			pt: "Um monorepo de ferramentas para desenvolvedores, começando pela gestão do fluxo de trabalho do GitHub: configurações, labels, milestones e regras de issues definidas em um único arquivo.",
		},
		year: 2026,
		tech: ["Rust", "GitHub API", "Nix"],
		repository: `${githubUser}/tools`,
	},
	{
		slug: "portfolio",
		title: "Portfolio",
		summary: {
			en: "This site: a statically exported Next.js portfolio in English and Portuguese, deployed to Cloudflare Pages with Terraform.",
			pt: "Este site: um portfólio em Next.js com exportação estática, em inglês e português, publicado no Cloudflare Pages com Terraform.",
		},
		year: 2026,
		tech: ["Next.js", "TypeScript", "Terraform"],
		repository: `${githubUser}/portfolio`,
		demo: portfolioDemo,
	},
];

export function getProjects(locale: Locale): Project[] {
	return definitions.map(({ summary, repository, demo, ...rest }) => ({
		...rest,
		summary: summary[locale],
		links: {
			repository,
			...(demo !== undefined ? { demo: typeof demo === "string" ? demo : demo[locale] } : {}),
		},
	}));
}
