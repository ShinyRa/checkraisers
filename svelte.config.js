import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

//const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess({ typescript: { tsconfigFile: './tsconfig.json' } }),

	kit: {
		adapter: adapter(),
		files: {
			lib: './lib',
			assets: './static',
			template: './static/app.html',
			hooks: './lib/logic/frontend/hooks',
			routes: './src/frontend/routes' // /frontend/routes folder as routing entry point
		},
		vite: {
			plugins: [
				{
					name: 'socket-io',
					// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
					configureServer(server) {
						import('./lib/backend/socketServer/server.cjs');
					}
				}
			],
			resolve: {
				alias: {
					'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js'
				}
			}
		}
	}
};

export default config;
