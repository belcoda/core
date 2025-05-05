import { json, error, pino, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
const log = pino(import.meta.url);

import * as m from '$lib/paraglide/messages';

import { read as readPerson } from '$lib/server/api/people/people';
import {
	_getByAction,
	read as readMessage
} from '$lib/server/api/communications/whatsapp/messages.js';
import { _idempotentUpdateExpiryTime } from '$lib/server/api/communications/whatsapp/conversations.js';

import {
	update as updateSentMessage,
	_getSentWhatsappMessageById
} from '$lib/server/api/communications/whatsapp/sent_messages';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type === 'whatsapp.message.updated') {
			const messageId = parsed.whatsappMessage.externalId;
			log.debug(`messageId = ${messageId}`);
			if (!messageId)
				throw new BelcodaError(
					400,
					'DATA:/webhooks/whatsapp/+server.ts:01',
					m.teary_dizzy_earthworm_urge()
				);
			const sentMessage = await _getSentWhatsappMessageById({ sentMessageId: messageId });
			log.debug(`_getSentWhatsappMessageById = ${sentMessage.id}`);
			const person = await readPerson({
				instance_id: event.locals.instance.id,
				person_id: sentMessage.person_id
			});
			log.debug(`person = ${person.id}`);
			const message = await readMessage({
				instanceId: event.locals.instance.id,
				messageId: sentMessage.message_id
			});
			log.debug(`readMessage = ${message.id}`);
			if (parsed.whatsappMessage.status === 'sent') {
				try {
					if (
						parsed.whatsappMessage.conversation &&
						parsed.whatsappMessage.conversation.expiration_timestamp
					) {
						// For now we don't need to worry about conversations.
						/* if (message.thread_id) {
							const createConversationBody = {
								thread_id: message.thread_id,
								person_id: person.id,
								whatsapp_id: parsed.whatsappMessage.conversation.id,
								type: parsed.whatsappMessage.conversation.origin.type,
								expires_at: new Date(
									Number(parsed.whatsappMessage.conversation.expiration_timestamp) * 1000
								) //it's in seconds, not miliseconds
							};
							await createConversation({
								instanceId: event.locals.instance.id,
								body: createConversationBody,
								t: event.locals.t
							});
						} */
					}
				} catch (err) {
					//we'd expect this to err sometimes
					log.error(err);
				} finally {
					//post MVP TODO: Add OnSentAction
				}
			}

			if (parsed.whatsappMessage.status === 'delivered') {
				await updateSentMessage({
					instanceId: event.locals.instance.id,
					messageId: sentMessage.message_id,
					body: { delivered: true },
					personId: person.id,
					t: event.locals.t
				});
			}
			if (parsed.whatsappMessage.status === 'read') {
				//TODO: mark read
				await updateSentMessage({
					instanceId: event.locals.instance.id,
					messageId: sentMessage.message_id,
					body: { read: true },
					personId: person.id,
					t: event.locals.t
				});
				//post MVP TODO: Add OnReadAction
			}

			return json({ success: true });
		}

		if ('whatsappMessage' in parsed) {
			const sentMessageId = parsed.whatsappMessage.externalId;
			if (!sentMessageId) {
				throw new Error('Invalid webhook type. No sentMessageId');
			}
			const sentMessage = await _getSentWhatsappMessageById({ sentMessageId });
			const person = await readPerson({
				instance_id: event.locals.instance.id,
				person_id: sentMessage.person_id
			});

			switch (parsed.whatsappMessage.status) {
				case 'sent': {
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId: sentMessage.message_id,
						body: { wamid: parsed.whatsappMessage.wamid },
						personId: person.id,
						t: event.locals.t
					});
					break;
				}
				case 'delivered': {
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId: sentMessage.message_id,
						body: { delivered: true, wamid: parsed.whatsappMessage.wamid },
						personId: person.id,
						t: event.locals.t
					});
					break;
				}
				case 'read': {
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId: sentMessage.message_id,
						body: { read: true, wamid: parsed.whatsappMessage.wamid },
						personId: person.id,
						t: event.locals.t
					});
					break;
				}
				case 'failed': {
					log.error(
						parsed.whatsappMessage,
						`Sent whatsApp message with id ${sentMessageId} failed.`
					);
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId: sentMessage.message_id,
						body: { read: false, delivered: false, wamid: parsed.whatsappMessage.wamid },
						personId: person.id,
						t: event.locals.t
					});
					break;
				}
				default: {
					log.debug(
						parsed.whatsappMessage,
						`Unknown whatsapp message update status: ${parsed.whatsappMessage.status}`
					);
					break;
				}
			}
		}

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/whatsapp/webhook/ycloud/update/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
