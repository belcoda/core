import { json, error, pino } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { webhook } from '$lib/schema/communications/whatsapp/webhooks/webhook';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';
import { create as createReceivedMessage } from '$lib/server/api/communications/whatsapp/received_messages';
import { create as createInteraction } from '$lib/server/api/people/interactions';
import { create as createInteractionSchema } from '$lib/schema/people/interactions';
import { _getPersonByWhatsappId } from '$lib/server/api/people/people';
import { triggerAction } from '$lib/schema/communications/actions/actions';
import { _idempotentUpdateExpiryTime } from '$lib/server/api/communications/whatsapp/conversations.js';

import { update as updateSentMessage } from '$lib/server/api/communications/whatsapp/sent_messages';
import { create as createConversation } from '$lib/server/api/communications/whatsapp/conversations';
import { read as readMessage } from '$lib/server/api/communications/whatsapp/messages';
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(webhook.entries.entry.item.entries.changes.item, body);
		const value = parsed.value;
		if (value.messages && value.contacts) {
			for (let index = 0; index < value.messages.length; index++) {
				const message = value.messages[index];
				//const contact = value.contacts[index];
				//TODO: need to fix phone number matching, because at the moment everyone's phone number is stored in the database in a non-normalized format.
				const person = await _getPersonByWhatsappId({
					instanceId: event.locals.instance.id,
					whatsappId: message.from
				});
				const receivedMessageToCreate = {
					person_id: person.id,
					message_id: message.id,
					message: message
				};
				const receivedMessage = await createReceivedMessage({
					instanceId: event.locals.instance.id,
					body: receivedMessageToCreate,
					t: event.locals.t
				});

				// generate an inbound_whatsapp artifact to save in the database
				const interaction = {
					person_id: person.id,
					admin_id: event.locals.admin.id,
					details: {
						type: 'inbound_whatsapp',
						message_id: receivedMessage.id,
						message: message //this is the message object.
					}
				};
				const interactionParsed = parse(createInteractionSchema, interaction);

				await createInteraction({
					instanceId: event.locals.instance.id,
					body: interactionParsed,
					t: event.locals.t
				});

				// if the message type is button... then find the matching message to the interactive ID.
				if (message.type === 'button') {
					try {
						if (message.button.payload) {
							const payload = message.button.payload; //this is the uuid of the action...
							const actionParsed = parse(triggerAction, {
								type: 'whatsapp_message',
								person_id: person.id,
								received_whatsapp_message_id: receivedMessage.id,
								action_id: payload
							});
							await event.locals.queue(
								'/utils/communications/actions',
								event.locals.instance.id,
								actionParsed,
								event.locals.admin.id
							);
						}
					} catch (err) {
						log.error(err);
					}
				}
			}
		}
		if (value.statuses) {
			for (const status of value.statuses) {
				const messageId = status.biz_opaque_callback_data || 'null'; //TODO: Figure out what to do when it's not a response or status to one of our messages with a biz_opaque_callback_data
				const person = await _getPersonByWhatsappId({
					instanceId: event.locals.instance.id,
					whatsappId: status.recipient_id
				});
				if (status.status === 'sent') {
					if (status.conversation && status.conversation.expiration_timestamp) {
						try {
							const sentMessageObject = await readMessage({
								instanceId: event.locals.instance.id,
								messageId
							});
							if (sentMessageObject.thread_id) {
								const createConversationBody = {
									thread_id: sentMessageObject.thread_id,
									person_id: person.id,
									whatsapp_id: status.conversation.id,
									type: status.conversation.origin.type,
									expires_at: new Date(Number(status.conversation.expiration_timestamp) * 1000) //it's in seconds, not miliseconds
								};
								await createConversation({
									instanceId: event.locals.instance.id,
									body: createConversationBody,
									t: event.locals.t
								});
							}
						} catch (err) {
							//we'd expect this to error sometimes
							log.error(err);
						}
					}

					//post MVP TODO: Add OnSentAction
				}
				if (status.status === 'delivered') {
					//TODO: mark delivered??
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId,
						body: { delivered: true },
						personId: person.id,
						t: event.locals.t
					});
				}
				if (status.status === 'read') {
					//TODO: mark read
					await updateSentMessage({
						instanceId: event.locals.instance.id,
						messageId,
						body: { read: true },
						personId: person.id,
						t: event.locals.t
					});
					//post MVP TODO: Add OnReadAction
				}
				if (status.conversation) {
					const conversationId = status.conversation.id;
					const conversationTimestamp = status.conversation.expiration_timestamp
						? new Date(Number(status.conversation.expiration_timestamp) * 1000)
						: null; //it's in seconds, as a string
					if (conversationTimestamp)
						await _idempotentUpdateExpiryTime({
							whatsappId: conversationId,
							expiresAt: conversationTimestamp
						});
				}
			}
		}
		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/webhooks/whatsapp/+server.ts', m.spry_ago_baboon_cure(), err);
	}
}
