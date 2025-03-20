import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => Promise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';
import { BelcodaError, pino } from '$lib/server';
import { YCLOUD_VERIFY_TOKEN } from '$env/static/private';

import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
import {
	_getInstanceByWhatsappBAId,
	_getInstanceByWhatsappPhoneNumberId,
	read
} from '$lib/server/api/core/instances';
import { _getSentWhatsappMessageById } from '$lib/server/api/communications/whatsapp/sent_messages';
import { _getInstanceIdByPersonId } from '$lib/server/api/people/people';

const log = pino(import.meta.url);
export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	log.info(`📞 ${event.request.method} ${event.url.pathname}`);
	if (event.url.searchParams.get('verify') !== YCLOUD_VERIFY_TOKEN) {
		log.error('Invalid Ycloud verify token');
		return {
			continue: false,
			response: new Response('200 OK HTTPS', { status: 200 })
		};
	}
	const body = await event.request.json();
	log.debug(body);
	try {
		//coz we want to be able to respond to the webhook even if we error
		const parsed = parse(yCloudWebhook, body);
		switch (parsed.type) {
			case 'whatsapp.business_account.deleted': {
				log.debug('whatsapp.business_account.deleted');
				log.debug(parsed);
				break;
			}
			case 'whatsapp.business_account.updated': {
				log.debug('whatsapp.business_account.updated');
				log.debug(parsed);
				break;
			}
			case 'whatsapp.message.updated': {
				log.debug('whatsapp.message.updated');
				if (parsed.whatsappMessage.externalId) {
					const message = await _getSentWhatsappMessageById({
						sentMessageId: parsed.whatsappMessage.externalId
					});
					log.debug(`message = ${message.id}`);
					const instanceId = await _getInstanceIdByPersonId({ personId: message.person_id });
					const instance = await read({ instance_id: instanceId });
					await event.locals.queue(
						'/whatsapp/webhook/ycloud/update',
						instance.id,
						parsed,
						instance.settings.default_admin_id
					);
				}
				break;
			}
			case 'whatsapp.inbound_message.received': {
				log.debug('whatsapp.inbound_message.received');
				const instance = await _getInstanceByWhatsappBAId({
					whatsappBAId: parsed.whatsappInboundMessage.wabaId
				});
				log.debug(`instance = ${instance.id}`);
				await event.locals.queue(
					'/whatsapp/webhook/ycloud/incoming',
					instance.id,
					parsed,
					instance.settings.default_admin_id
				);
				break;
			}
			default: {
				log.debug('Unknown webhook type');
				log.debug(parsed);
			}
		}
	} catch (err) {
		log.error(err);
	} finally {
		//but still respond with 200 OK to the webhook
		return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
	}
}
