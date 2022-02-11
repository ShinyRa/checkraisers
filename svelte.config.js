import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess({ typescript: { tsconfigFile: './tsconfig.json' } }),

	kit: {
		/**
		 * Build command which is only ran while compiling to static HTML site in Gitlab pipeline
		 */
		adapter: adapter({ pages: 'build', assets: 'build', fallback: null }),
		paths: { base: dev ? '' : '/pokerapp' }, // If building on Gitlab, set base url to /pokerapp repository
		appDir: 'app', // Don't use standard _app structure as this is hidden to the sveltekit router
		prerender: {
			crawl: true,
			enabled: true,
			entries: ['*']
		},
		files: {
			lib: './backend',
			assets: './static',
			template: './static/app.html',
			routes: './frontend/routes' // /frontend/routes folder as routing entry point
		}
	}
};

export default config;
