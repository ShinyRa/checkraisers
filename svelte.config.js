import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { SocketServer } from '$lib/SocketServer';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess({ typescript: { tsconfigFile: './tsconfig.json' } }),

	kit: {
		/**
		 * Build command which is only ran while compiling to static HTML site in Gitlab pipeline
		 */
		adapter: adapter(),
		paths: { base: dev ? '' : '/2122/ivse2/IVSE2-MUCKERS/pokerapp' }, // If building on Gitlab, set base url to /pokerapp repository
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
		},	
        vite: {
            plugins: [
                {
                    name: 'socket-io',
                    configureServer(server) {
						console.log(SocketServer.initServer(server))
                    }
                }
            ]
        }
	}
};

export default config;
