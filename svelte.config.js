import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { Server } from 'socket.io';

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
                    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
                    configureServer(server) {
                        const io = new Server(server.httpServer);

                        // Socket.IO stuff goes here                

                        console.log('SocketIO injected: ', io);
                    }
                }
            ]
        }
	}
};

export default config;
