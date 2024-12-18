import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';
Sentry.init({
	dsn: 'https://8b4cdb05d7907fe3f9b43aec4a060811@o4508220361342976.ingest.de.sentry.io/4508220380282960',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
	enabled: !dev,
	// Optional: Initialize Session Replay:
	integrations: [Sentry.replayIntegration()],
	replaysSessionSampleRate: 0.05,
	replaysOnErrorSampleRate: 1.0
});

export const handleError = Sentry.handleErrorWithSentry();
