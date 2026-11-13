import type { Locale } from "@/shared/config/site";

export interface Dictionary {
	meta: {
		title: string;
		description: string;
		siteName: string;
	};
	a11y: {
		skipLink: string;
		mainNavigation: string;
		languageSwitcher: string;
		opensInNewTab: string;
	};
	nav: {
		about: string;
		projects: string;
		experience: string;
		contact: string;
	};
	hero: {
		name: string;
		role: string;
		headline: string;
		intro: string;
		ctaProjects: string;
		ctaContact: string;
	};
	about: {
		title: string;
		p1: string;
		p2: string;
	};
	projects: {
		title: string;
		lead: string;
		repository: string;
		liveDemo: string;
	};
	experience: {
		title: string;
		/** Label for an open-ended role, shown instead of an end date. */
		present: string;
		/** Newest first. `start` and `end` are ISO months (`YYYY-MM`); no `end` means current. */
		entries: readonly {
			role: string;
			company: string;
			start: string;
			end?: string;
			highlights: readonly string[];
		}[];
	};
	skills: {
		title: string;
		groups: readonly { label: string; items: readonly string[] }[];
	};
	contact: {
		title: string;
		lead: string;
		email: string;
		github: string;
		linkedin: string;
		cv: Record<Locale, { view: string; download: string; downloadLabel: string }>;
	};
	notFound: {
		/** Browser tab title of the 404 page. */
		metaTitle: string;
		eyebrow: string;
		title: string;
		message: string;
		home: string;
	};
	footer: {
		copyright: string;
		sourceCode: string;
		backToTop: string;
	};
}
