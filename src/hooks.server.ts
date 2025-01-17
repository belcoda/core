import { pino } from '$lib/server';
import { COOKIE_SESSION_NAME } from '$env/static/private';

import { buildLocalLanguage } from '$lib/server/hooks/build_locals';
import { del as expireSession } from '$lib/server/api/core/sessions';
import { buildAdminInstance } from '$lib/server/hooks/build_locals';
import { Localization } from '$lib/i18n';
import createDefaultInstance from '$lib/server/utils/install/default_instance';
import { _count, _count as _countInstance } from '$lib/server/api/core/instances';
process.on('warning', (e) => console.warn(e.stack));

const log = pino('hooks.server.ts');
import mainHandler from '$lib/server/hooks/handlers';

import { default as queue } from '$lib/server/utils/queue/add_job';

import * as Sentry from '@sentry/sveltekit';
import { type HandleServerError, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';

Sentry.init({
	dsn: 'https://8b4cdb05d7907fe3f9b43aec4a060811@o4508220361342976.ingest.de.sentry.io/4508220380282960',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	enabled: !dev, //not enabled in dev
	tracesSampleRate: 1.0
});

export const handleError: HandleServerError = Sentry.handleErrorWithSentry();

export async function handleFetch({ event, request, fetch }) {
	return await fetch(request);
}

const belcodaHandler: Handle = async ({ event, resolve }) => {
	// Set up the language and translation functions (THIS MUST BE FIRST)
	event.locals.language = buildLocalLanguage(event);
	event.locals.t = new Localization(event.locals.language);
	event.locals.queue = queue;

	//get all instances. If the count is zero, run the install script... this is a one-time thing.
	const instanceCount = await _countInstance();
	if (!(instanceCount > 0)) {
		await createDefaultInstance(event.locals.t, queue);
	}

	const mainHandlerOutput = await mainHandler(event, resolve);
	if (mainHandlerOutput.continue === false) return mainHandlerOutput.response;

	if (event.url.pathname.startsWith('/logout')) {
		try {
			await expireSession({ code: event.cookies.get(COOKIE_SESSION_NAME) || 'NULL_CODE' });
		} catch (err) {
			log.error(err);
		} finally {
			return new Response(null, {
				status: 302,
				headers: { location: '/login' }
			});
		}
	}

	if (event.url.pathname.startsWith('/auth/google')) {
		const response = await resolve(event);
		return response;
	}
	if (event.url.pathname.startsWith('/unsubscribe')) {
		const response = await resolve(event);
		return response;
	}

	const {
		authenticated,
		event: returnEvent,
		jsonResponse,
		response: apiResponse
	} = await buildAdminInstance({ event });
	if (jsonResponse && apiResponse) {
		return apiResponse;
	}
	if (event.url.pathname.startsWith('/login')) {
		if (authenticated) {
			return new Response(null, {
				status: 302,
				headers: { location: '/' }
			});
		} else {
			const response = await resolve(returnEvent);

			return response;
		}
	}

	if (!authenticated) {
		// Get the url that the user is trying to visit for redirection after login
		const url = event.url.pathname + event.url.search;
		return new Response(null, {
			status: 302,
			headers: {
				location: '/login' + (url === '/login' || url === '/' ? '' : '?continue=' + url)
			}
		});
	}
	log.info(
		`🔒 ${event.request.method}: (${event.url.href}) [${event.locals.instance.slug}/${event.locals.admin?.id}]`
	);
	const response = await resolve(returnEvent);
	return response;
};

export const handle = sequence(
	Sentry.sentryHandle({ injectFetchProxyScript: false }), //Conflicts with CSP and no longer needed in SvelteKit 2, see here https://github.com/getsentry/sentry-javascript/pull/9969
	belcodaHandler
);
