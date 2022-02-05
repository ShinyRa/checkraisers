import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess(),

	kit: {
		/**
		 * Adapter config for Github / Gitlab pages
		 */
		// adapter: adapter({ pages: 'build', assets: 'build', fallback: null })
		adapter: adapter({
			out: 'build',
			precompress: false
		})
	}
};

export default config;
