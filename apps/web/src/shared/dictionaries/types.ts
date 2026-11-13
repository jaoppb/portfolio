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
	systemStatus: {
		title: string;
		description: string;
		operational: string;
		target: string;
		targetValue: string;
		framework: string;
		frameworkValue: string;
		milestone: string;
		documentation: string;
		sourceSpecs: string;
	};
	footer: {
		copyright: string;
		sourceCode: string;
		backToTop: string;
	};
}
