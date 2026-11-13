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
	projects: {
		title: "Projects",
		lead: "Open-source work in Rust and TypeScript, from systems tooling to this site.",
		repository: "Repository",
		liveDemo: "Live demo",
	},
	experience: {
		title: "Experience",
		present: "Present",
		entries: [
			{
				role: "Software Engineer I",
				company: "Hotmart",
				start: "2026-07",
				highlights: [
					"High-traffic web development (React/Next.js) and backend for lead generation and GMV.",
					"Engineering low-latency Node.js APIs applying Clean Architecture and DDD.",
					"DynamoDB data modeling supporting unpredictable campaign traffic spikes and CRM integrations.",
					"Cloud infrastructure management via Terraform and CI/CD pipeline automation with GitHub Actions.",
				],
			},
			{
				role: "Software Engineer Intern",
				company: "Hotmart",
				start: "2025-10",
				end: "2026-07",
				highlights: [
					"Implementation of Node microservices, AWS resources (Terraform), and front-end using Next.js.",
				],
			},
		],
	},
	skills: {
		title: "Skills",
		groups: [
			{
				label: "Languages & Technologies",
				items: [
					"TypeScript",
					"Node.js",
					"React.js",
					"Next.js",
					"Rust",
					"Python",
					"Java",
					"C/C++",
					"Shell script",
					"Tailwind CSS",
				],
			},
			{
				label: "Architecture & Cloud",
				items: [
					"AWS",
					"Terraform",
					"Clean Architecture",
					"DDD",
					"Microservices",
					"CI/CD",
					"GitHub Actions",
				],
			},
			{
				label: "Databases & Infra",
				items: ["DynamoDB", "SQL", "PostgreSQL", "Docker", "Linux"],
			},
		],
	},
	contact: {
		title: "Contact",
		lead: "Open to new challenges and conversations. Email is the best way to reach me.",
		email: "Email",
		github: "GitHub",
		linkedin: "LinkedIn",
		cv: {
			en: {
				view: "View CV (PDF, English)",
				download: "Download",
				downloadLabel: "Download CV (PDF, English)",
			},
			pt: {
				view: "View CV (PDF, Portuguese)",
				download: "Download",
				downloadLabel: "Download CV (PDF, Portuguese)",
			},
		},
	},
	footer: {
		copyright: "© 2026 João Pedro",
		sourceCode: "Source code",
		backToTop: "Back to top",
	},
};
