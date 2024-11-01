import { pino } from '$lib/server';
import { COOKIE_SESSION_NAME } from '$env/static/private';

import { buildLocalLanguage } from '$lib/server/hooks/build_locals';
import { del as expireSession } from '$lib/server/api/core/sessions';
import { buildAdminInstance } from '$lib/server/hooks/build_locals';
import { Localization } from '$lib/i18n';
import { default as install } from '$lib/server/hooks/installation/install';
process.on('warning', (e) => console.warn(e.stack));

const log = pino('hooks.server.ts');
import mainHandler from '$lib/server/hooks/handlers';

import { default as queue } from '$lib/server/utils/queue/add_job';

export async function handleFetch({ event, request, fetch }) {
	log.info(`🍔 FETCH ${event.request.method} ${event.url.href}`);
	return await fetch(request);
}

export async function handle<Handle>({ event, resolve }) {
	// Set up the language and translation functions (THIS MUST BE FIRST)
	event.locals.language = buildLocalLanguage(event);
	event.locals.t = new Localization(event.locals.language);
	event.locals.queue = queue;

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
	if (jsonResponse && apiResponse) return apiResponse;
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
		return new Response(null, {
			status: 302,
			headers: { location: '/login' }
		});
	}

	if (event.locals.instance.installed === false) {
		event = await install(event);
	}

	const response = await resolve(returnEvent);
	return response;
}
