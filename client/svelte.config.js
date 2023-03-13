// import nodeAdapter from '@sveltejs/adapter-node';    // Use when running on node server with custom peer server
import netlifyAdapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter: nodeAdapter()     // Use when running on node server with custom peer server
		adapter: netlifyAdapter()
	}
};

export default config;
