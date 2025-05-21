import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import circleDependency from 'vite-plugin-circular-dependency';
export default defineConfig({
	optimizeDeps: {
		exclude: ['lucide-svelte']
	},
	plugins: [
		sentrySvelteKit(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),
		circleDependency({
			outputFilePath: './circular-dependencies.txt'
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		reporters: ['default', 'html'],
		outputFile: 'vitest/results/index.html',
		coverage: {
			include: ['src/**/*.{js,ts}'],
			exclude: ['src/lib/i18n/localizations/**/*', 'src/zapatos/**/*', 'src/lib/paraglide/**/*'],
			reporter: ['text', 'json', 'html'],
			reportsDirectory: 'vitest/coverage'
		}
	},
	build: {
		commonjsOptions: { transformMixedEsModules: true } // Change
	}
});
