import { UMAMI_API_KEY } from '$env/static/private';
import {
	PUBLIC_UMAMI_WEBSITE_ID,
	PUBLIC_ROOT_DOMAIN,
	PUBLIC_UMAMI_REFERRER_ID
} from '$env/static/public';
import { type RequestEvent } from '@sveltejs/kit';
import { pino } from '$lib/server';
import { dev } from '$app/environment';
const log = pino(import.meta.url);
export default async function (event: RequestEvent): Promise<void> {
	try {
		const payload = {
			hostname: event.url.hostname,
			language: event.locals.language,
			referrer: event.request.headers.get('referer') || PUBLIC_UMAMI_REFERRER_ID,
			domain: PUBLIC_ROOT_DOMAIN,
			screen: 'N/A',
			title: 'N/A',
			url: event.url.href,
			name: `${event.request.method}`,
			website: PUBLIC_UMAMI_WEBSITE_ID,
			data: {
				team: event.locals.instance?.slug || 'UNKNOWN',
				id: event.locals.admin?.id || 'UNKNOWN'
			}
		};
		if (dev) {
			const headers = {
				'Content-Type': 'application/json',
				'x-umami-api-key': UMAMI_API_KEY,
				'user-agent': event.request.headers.get('user-agent') || 'BelcodaFetch'
			};
			const response = await fetch('https://cloud.umami.is/api/send', {
				method: 'POST',
				headers,
				body: JSON.stringify({
					type: 'event',
					payload
				})
			});
			if (response.status !== 200) {
				log.debug(payload);
				log.warn(
					`Failed to log analytics event (${response.statusText}): ${await response.text()}`
				);
			}
		}
	} catch (err) {
		log.error(err);
	}
}
