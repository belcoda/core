import { type RequestEvent } from '@sveltejs/kit';
import { parseLocale } from '$lib/i18n';
import type { SL } from '$lib/i18n';
import { pino } from '$lib/server';

import getApiKey from '$lib/server/hooks/get_api_key';
import getSession from '$lib/server/hooks/get_session';

export function buildLocalLanguage(event: RequestEvent): SL[number] {
	const locale = parseLocale(event);
	return locale;
}

const log = pino('$lib/server/hooks/build_locals');
import logToAnalytics from '$lib/server/hooks/analytics/log';

export async function buildAdminInstance({ event }: { event: RequestEvent }): Promise<{
	authenticated: boolean;
	event: RequestEvent;
	//in this context, jsonResponse means building a Response in this function and returning it directly
	jsonResponse: boolean; //only used for errors
	response?: Response;
}> {
	if (event.url.pathname.startsWith('/api/v1')) {
		try {
			const { admin, instance } = await getSession(event);
			event.locals.admin = admin;
			event.locals.instance = instance;
			event.locals.language = instance.language;
			//log the request to umami only on /api/v1 routes
			await logToAnalytics(event);
			return { authenticated: true, event, jsonResponse: false };
		} catch (err) {
			log.trace(err);
			try {
				// the API key didn't work, but maybe there's a session cookie
				const { admin, instance } = await getApiKey(event);
				event.locals.admin = admin;
				event.locals.instance = instance;
				event.locals.language = instance.language;
				//log the request to umami only on /api/v1 routes
				await logToAnalytics(event);
				return { authenticated: true, event, jsonResponse: false };
			} catch (err) {
				log.error(err);
				// no session cookie either
				if (err instanceof Error) {
					return {
						authenticated: false,
						event,
						jsonResponse: true,
						response: new Response(JSON.stringify({ error: err.message }), { status: 401 })
					};
				} else {
					return {
						authenticated: false,
						event,
						jsonResponse: true,
						response: new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 })
					};
				}
			}
		}
	}

	try {
		const { admin, instance } = await getSession(event);
		event.locals.admin = admin;
		event.locals.instance = instance;
		event.locals.language = instance.language;
		return { authenticated: true, event, jsonResponse: false };
	} catch (err) {
		log.error(err);
		return { authenticated: false, event, jsonResponse: false };
	}
}
