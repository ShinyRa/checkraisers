import GitLabPagesAdapter from '@sveltejs/adapter-static';
import DevelopmentAdapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

// const dev = process.env.NODE_ENV === 'development';
const dev = true;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess(),

	kit: {
		/**
		 * Adapter config for Github / Gitlab pages
		 */
		adapter: dev
			? DevelopmentAdapter()
			: GitLabPagesAdapter({ pages: 'build', assets: 'build', fallback: null }),
		paths: { base: dev ? '' : '/pokerapp' },
		appDir: 'app',
		prerender: {
			crawl: true,
			enabled: true,
			entries: ['*']
		},
		files: {
			assets: '../static',
			routes: './',
			template: '../src/app.html'
		}
	}
};

export default config;
