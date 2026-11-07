import type { Dictionary } from "./types";

export const ptDictionary: Dictionary = {
	meta: {
		title: "João Pedro — Engenheiro de Software",
		description:
			"Portfólio pessoal e vitrine de engenharia por João Pedro. Construído com exportação estática Next.js.",
		siteName: "Portfólio de João Pedro",
	},
	a11y: {
		skipLink: "Pular para o conteúdo principal",
		mainNavigation: "Navegação principal",
		languageSwitcher: "Alternador de idioma",
		opensInNewTab: "(abre em nova aba)",
	},
	nav: {
		about: "Sobre",
		projects: "Projetos",
		experience: "Experiência",
		contact: "Contato",
	},
	hero: {
		name: "João Pedro",
		role: "Engenheiro de Software",
		headline: "Engenheiro full stack com foco em arquitetura e cloud.",
		intro: "Crio interfaces web em React e Next.js e serviços Node.js de baixa latência, e cuido da infraestrutura cloud por trás deles com AWS e Terraform. Priorizo soluções escaláveis, de fácil manutenção e com ótimo custo-benefício em ambientes de alto tráfego.",
		ctaProjects: "Ver projetos",
		ctaContact: "Entrar em contato",
	},
	about: {
		title: "Sobre",
		p1: "Trabalho na Hotmart, em Belo Horizonte, com web e backend de alto tráfego para geração de leads e GMV: APIs Node.js com Clean Architecture e DDD, modelagem no DynamoDB para picos imprevisíveis de tráfego de campanhas e infraestrutura como código com Terraform e GitHub Actions.",
		p2: "Estudo Engenharia de Software na PUC Minas e crio projetos que operam dentro de limites rígidos de hardware e orçamento, como o PUCMaps na AWS e o Styx em Rust. Minha equipe depende.sh ficou em 1º lugar na Maratona Mineira de Programação (Grande BH).",
	},
	projects: {
		title: "Projetos",
		lead: "Projetos de código aberto em Rust e TypeScript, de ferramentas de sistemas a este site.",
		repository: "Repositório",
		liveDemo: "Demonstração",
	},
	systemStatus: {
		title: "Status de Arquitetura e Skeleton",
		description:
			"Configuração pura de exportação estática e verificação de fronteiras feature-first.",
		operational: "Operacional",
		target: "Destino",
		targetValue: "Cloudflare Pages (output: export)",
		framework: "Framework",
		frameworkValue: "Next.js 16",
		milestone: "Marco",
		documentation: "Documentação",
		sourceSpecs: "Especificações",
	},
	footer: {
		copyright: "© 2026 João Pedro",
		sourceCode: "Código-fonte",
		backToTop: "Voltar ao topo",
	},
};
