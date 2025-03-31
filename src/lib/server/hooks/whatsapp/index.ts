import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => Promise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';
import { pino } from '$lib/server';
import { WHATSAPP_VERIFY_TOKEN, FACEBOOK_API_APP_SECRET, _ } from '$env/static/private';
import { createHmac } from 'crypto';

import { parse } from '$lib/schema/valibot';
import { webhook } from '$lib/schema/communications/whatsapp/webhooks/webhook';
import { _getInstanceByWhatsappPhoneNumberId } from '$lib/server/api/core/instances';

const log = pino(import.meta.url);
export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	log.info(`📞 ${event.request.method} ${event.url.href}`);
	const challenge = event.url.searchParams.get('hub.challenge');
	const verifyToken = event.url.searchParams.get('hub.verify_token');
	if (verifyToken && challenge) {
		if (WHATSAPP_VERIFY_TOKEN === verifyToken) {
			return {
				continue: false,
				response: new Response(challenge, { status: 200, statusText: 'OK' })
			};
		} else {
			return {
				continue: false,
				response: new Response(null, { status: 403, statusText: 'Forbidden' })
			};
		}
	} else {
		//it's an event notification
		const body = await event.request.json();
		log.debug(body);
		const headerSignature = event.request.headers.get('X-Hub-Signature-256'); //We sign all Event Notification payloads with a SHA256 signature and include the signature in the request's X-Hub-Signature-256 header, preceded with sha256=.
		const hmac = createHmac('sha256', FACEBOOK_API_APP_SECRET)
			.update(JSON.stringify(body))
			.digest('hex');
		if (`sha256=${hmac}` !== headerSignature) {
			log.error('Invalid signature');
			return {
				continue: false,
				response: new Response('200 OK HTTPS', { status: 200 })
			};
		}
		try {
			//coz we want to be able to respond to the webhook even if we error
			const parsed = parse(webhook, body);
			for (let index = 0; index < parsed.entry.length; index++) {
				const entry = parsed.entry[index];
				for (let j = 0; j < entry.changes.length; j++) {
					const change = entry.changes[j];
					const value = change.value;
					const PHONE_NUMBER_ID = value.metadata.phone_number_id;
					const instance = await _getInstanceByWhatsappPhoneNumberId({
						whatsappPhoneNumberId: PHONE_NUMBER_ID
					});
					await event.locals.queue(
						'/whatsapp/webhook',
						instance.id,
						change,
						instance.settings.default_admin_id
					);
				}
			}
		} catch (err) {
			log.error(err);
			//but still respond with 200 OK to the webhook
			return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
		}

		return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
	}
}
