import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { initServer } from './backend/utils/socketServer.js';
import { mongoDB_client } from './backend/utils/mongodb.js';

//const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use svelte's preprocessor for html, css, scss and typescript. More info https://github.com/sveltejs/svelte-preprocess
	preprocess: preprocess({ typescript: { tsconfigFile: './tsconfig.json' } }),

	kit: {
		adapter: adapter(),
		files: {
			hooks: './frontend',
			lib: './backend',
			assets: './static',
			template: './static/app.html',
			routes: './frontend/routes' // /frontend/routes folder as routing entry point
		},
		vite: {
			plugins: [
				{
					name: 'socket-io',
					// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
					configureServer(server) {
						initServer(server);
					}
				},
				{
					name: 'mongo-DB',
					// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
					configureServer() {
						mongoDB_client;
					}
				}
			]
		}
	}
};

export default config;
