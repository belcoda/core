import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({ script: true }),

	kit: {
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'connect-src': ['self', `*.sentry.io`],
				// for now we need to keep 'unsafe-inline' for a couple of bits-ui components that inject inline event handlers
				// we also need it for our custom code options, which currently inject inline styles.
				'script-src': ['self', 'https://accounts.google.com', 'unsafe-inline'],
				'frame-src': ['self', 'https://accounts.google.com'],
				'frame-ancestors': ['self', 'https://accounts.google.com'],
				'style-src': ['self', 'unsafe-inline', 'https://accounts.google.com/gsi/style'],
				'worker-src': ['self', 'blob:'],
				'img-src': [
					'self',
					`https://${process.env.PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME}.s3.amazonaws.com`
				],
				'object-src': [
					`https://${process.env.PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME}.s3.amazonaws.com`
				]
			}
		},
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			precompress: false
		}),
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
