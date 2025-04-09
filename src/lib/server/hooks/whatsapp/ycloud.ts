import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => Promise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';

import { YCLOUD_VERIFY_TOKEN } from '$env/static/private';
import { PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER } from '$env/static/public';

import { pino } from '$lib/server/utils/logs/pino';
const log = pino(import.meta.url);

import { parse } from '$lib/schema/valibot';
import {
	yCloudWebhook,
	type YCloudWebhook
} from '$lib/schema/communications/whatsapp/webhooks/ycloud';
import { type Read as Instance } from '$lib/schema/core/instance';

import {
	_getInstanceByWhatsappPhoneNumber,
	_getInstanceByEventId,
	_getInstanceByPetitionId
} from '$lib/server/api/core/instances';

import {
	_getInstanceIdBySentMessageIdUnsafe,
	_getInstanceIdByWamidUnsafe,
	_getInstanceIdByActionUuidUnsafe
} from '$lib/server/api/communications/whatsapp/messages';

export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	try {
		log.info(`📞 ${event.request.method} ${event.url.pathname}`);
		checkYCloudToken(event);

		const body = await event.request.json();
		log.debug(body, 'Incoming YCloud webhook');
		const parsed = parse(yCloudWebhook, body);
		log.debug('Parsed YCloud webhook successful');

		switch (parsed.type) {
			case 'whatsapp.business_account.deleted': {
				log.debug('🪝 Webhook type: whatsapp.business_account.deleted');
				break;
			}
			case 'whatsapp.business_account.updated': {
				log.debug('🪝 Webhook type: whatsapp.business_account.updated');
				break;
			}
			case 'whatsapp.message.updated': {
				log.debug('🪝 Webhook type: whatsapp.message.updated');
				const externalId = parsed.whatsappMessage.externalId; // this should be populated for all updated events and is the id in the sent_whatsapp_messages table
				if (!externalId) {
					throw new Error('No externalId provided in whatsapp.message.updated event');
				}
				const instanceId = await _getInstanceIdBySentMessageIdUnsafe({ sentMessageId: externalId });
				await event.locals.queue('/whatsapp/webhook/ycloud/update', instanceId, parsed);
				break;
			}
			case 'whatsapp.inbound_message.received': {
				log.debug('🪝 Webhook type: whatsapp.inbound_message.received');
				/* 
				// Set up instanceId as the ID or null if we don't know it yet (ie: if it's the default).
				// Then we'll try different methods to find it out as we handle the different types of incoming messages. 
				// Once we've got the instanceId, we can pass it off to the right handler. If we're unable to get the instanceId, we'll ignore the message. 
				// The cases we will handle: 
				//  1. Text messages with an action (eg: [SIGNUP:334])
				//  2. Text messages WITHOUT an action
				//  3. Interactive messages (quick replies to interactive non-template messages)
				//	4. Button messages (quick replies to template messages)
				// A future TODO is to add support for media messages (images, videos, etc) and location messages, as well as contact messages, documents and voice notes. 
				*/
				const receivedPhoneNumber = parsed.whatsappInboundMessage.to; //the phone number the message was sent to (ie: our phone number)
				const instance = isDefaultWhatsAppNumber(receivedPhoneNumber)
					? null // default number, so we don't know the instance yet
					: await _getInstanceByWhatsappPhoneNumber({ whatsappPhoneNumber: receivedPhoneNumber });
				// an error will be thrown if the number is not default and also not of any instance

				switch (parsed.whatsappInboundMessage.type) {
					case 'text': {
						try {
							// check if there's a code in the message (ie: it's an action message);
							const { action, id } = extractCodeFromMessage(parsed);
							const instanceId =
								instance?.id || (await getInstanceFromMessageIdentifier({ action, id })).id;

							//we have the instanceId and we know it's an action message, so let's send to the action message handler.
							await event.locals.queue(
								'/whatsapp/webhook/ycloud/incoming/text/action',
								instanceId,
								parsed
							);
						} catch (err) {
							log.debug(err, 'Unable to extract code from message');
							try {
								// check if there's a reply to a previous message
								// try to get the instanceId from that if we still need it...
								const instanceId = instance?.id || (await getInstanceIdFromContext(parsed));
								// we have the instanceId and know it's a text message (non-action). So we can send it to the handler.
								await event.locals.queue(
									'/whatsapp/webhook/ycloud/incoming/text',
									instanceId,
									parsed
								);
							} catch (err) {
								log.debug(err, 'Unable to get instanceID from context.');
								log.debug('Unable to get instanceId for this text message. Ignoring it.');
							}
						}
						break;
					}
					case 'interactive': {
						try {
							if (
								parsed.whatsappInboundMessage.interactive &&
								parsed.whatsappInboundMessage.interactive.button_reply.id
							) {
								const payload = parsed.whatsappInboundMessage.interactive.button_reply.id;
								const instanceId =
									instance?.id || (await _getInstanceIdByActionUuidUnsafe({ actionUuid: payload }));
								// we have the instanceId and know it's an interactive message. So we can send it to the handler.
								await event.locals.queue(
									'/whatsapp/webhook/ycloud/incoming/interactive',
									instanceId,
									parsed
								);
							}
						} catch (err) {
							log.debug(err, 'Unable to get instanceID from button payload.');
							log.debug('Unable to get instanceId for this button message. Ignoring it.');
						}
					}
					case 'button': {
						try {
							if (
								parsed.whatsappInboundMessage.button &&
								parsed.whatsappInboundMessage.button.payload
							) {
								const payload = parsed.whatsappInboundMessage.button.payload;
								const instanceId =
									instance?.id || (await _getInstanceIdByActionUuidUnsafe({ actionUuid: payload }));
								// we have the instanceId and know it's a button message. So we can send it to the handler.
								await event.locals.queue(
									'/whatsapp/webhook/ycloud/incoming/button',
									instanceId,
									parsed
								);
							}
						} catch (err) {
							log.debug(err, 'Unable to get instanceID from button payload.');
							log.debug('Unable to get instanceId for this button message. Ignoring it.');
						}
					}
				}
				break;
			}
			default: {
				log.debug('🪝 Unknown webhook type');
				log.debug(parsed);
				break;
			}
		}
	} catch (err) {
		log.error(err);
	} finally {
		// We always want to respond with 200 OK to the webhook
		// even if we error, so we can continue receiving webhooks
		// and not get blocked by YCloud
		return {
			continue: false,
			response: new Response('200 OK HTTPS', { status: 200 })
		};
	}
}

export function checkYCloudToken(event: RequestEvent): void {
	if (event.url.searchParams.get('verify') !== YCLOUD_VERIFY_TOKEN) {
		log.error('Invalid Ycloud verify token');
		throw new Error('Invalid Ycloud verify token');
	}
}

export function isDefaultWhatsAppNumber(to: string): boolean {
	if (!to) {
		throw new Error('No phone number provided');
	}
	if (to === PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER) {
		return true;
	}
	return false;
}

export async function getInstanceFromWhatsAppNumber(to: string): Promise<Instance> {
	if (!to) {
		throw new Error('No phone number provided');
	}
	if (to === PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER) {
		throw new Error('WhatsApp phone number is default');
	}

	const instance = await _getInstanceByWhatsappPhoneNumber({ whatsappPhoneNumber: to });
	return instance;
}

export function extractCodeFromMessage(message: YCloudWebhook): {
	id: number;
	action: 'SIGNUP' | 'PETITION';
} {
	if (message.type !== 'whatsapp.inbound_message.received') {
		throw new Error(
			'extractCodeFromMessage(): Message type is not whatsapp.inbound_message.received'
		);
	}
	if (!message.whatsappInboundMessage.text) {
		throw new Error('extractCodeFromMessage(): No message text found');
	}
	const pattern = /\[(SIGNUP|PETITION):([0-9]+)\]/;
	const identifier = pattern.exec(message.whatsappInboundMessage.text.body);
	if (!identifier) {
		throw new Error('extractCodeFromMessage(): No identifier found');
	}
	const action = identifier[1] as 'SIGNUP' | 'PETITION'; // This is from the regex match
	if (!['SIGNUP', 'PETITION'].includes(action)) {
		throw new Error('extractCodeFromMessage(): Unknown action type');
	}
	const id = Number(identifier[2]);
	if (isNaN(id)) {
		throw new Error('extractCodeFromMessage(): No numerical ID found');
	}
	return { action, id };
}

export async function getInstanceFromMessageIdentifier({
	action,
	id
}: {
	action: 'SIGNUP' | 'PETITION';
	id: number;
}): Promise<Instance> {
	switch (action) {
		case 'SIGNUP': {
			return await _getInstanceByEventId(id);
		}
		case 'PETITION': {
			return await _getInstanceByPetitionId(id);
		}
		default: {
			throw new Error('Unknown action type');
		}
	}
}

export async function getInstanceIdFromContext(message: YCloudWebhook): Promise<number> {
	if (message.type !== 'whatsapp.inbound_message.received') {
		throw new Error('Message type is not whatsapp.inbound_message.received');
	}
	const context = message.whatsappInboundMessage.context; // this should be populated for all updated events and is the message ID in the whatsapp_messages table
	if (!context) {
		throw new Error('No context provided in whatsapp.inbound_message.received event');
	}
	if (!context.id) {
		throw new Error('No context.id provided in whatsapp.inbound_message.received event');
	}
	const instanceId = await _getInstanceIdByWamidUnsafe({ wamid: context.id });

	return instanceId;
}
