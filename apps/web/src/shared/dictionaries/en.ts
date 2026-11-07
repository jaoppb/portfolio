import type { Dictionary } from "./types";

export const enDictionary: Dictionary = {
	meta: {
		title: "João Pedro — Software Engineer",
		description:
			"Personal portfolio and engineering showcase by João Pedro. Built with Next.js static export.",
		siteName: "João Pedro Portfolio",
	},
	a11y: {
		skipLink: "Skip to main content",
		mainNavigation: "Main navigation",
		languageSwitcher: "Language switcher",
		opensInNewTab: "(opens in a new tab)",
	},
	nav: {
		about: "About",
		projects: "Projects",
		experience: "Experience",
		contact: "Contact",
	},
	hero: {
		name: "João Pedro",
		role: "Software Engineer",
		headline: "Full stack engineer focused on architecture and cloud.",
		intro: "I build web interfaces in React and Next.js and low-latency Node.js services, and run the cloud infrastructure behind them with AWS and Terraform. I favour scalable, maintainable, cost-effective solutions for high-traffic environments.",
		ctaProjects: "View projects",
		ctaContact: "Get in touch",
	},
	about: {
		title: "About",
		p1: "I work at Hotmart in Belo Horizonte on high-traffic web and backend systems for lead generation and GMV: Node.js APIs with Clean Architecture and DDD, DynamoDB modelling for unpredictable campaign traffic, and infrastructure as code with Terraform and GitHub Actions.",
		p2: "I am studying Software Engineering at PUC Minas and build projects that run within strict hardware and budget limits, such as PUCMaps on AWS and Styx in Rust. My team depende.sh took 1st place in the Minas Gerais Programming Marathon (Greater BH).",
	},
	systemStatus: {
		title: "Architecture & Skeleton Status",
		description: "Pure static export configuration and feature-first boundary verification.",
		operational: "Operational",
		target: "Target",
		targetValue: "Cloudflare Pages (output: export)",
		framework: "Framework",
		frameworkValue: "Next.js 16",
		milestone: "Milestone",
		documentation: "Documentation",
		sourceSpecs: "Source Specs",
	},
	footer: {
		copyright: "© 2026 João Pedro",
		sourceCode: "Source code",
		backToTop: "Back to top",
	},
};
