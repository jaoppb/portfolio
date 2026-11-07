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
		description: string;
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
