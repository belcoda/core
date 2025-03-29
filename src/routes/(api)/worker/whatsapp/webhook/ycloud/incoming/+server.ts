import { json, error, pino } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';
import { create as createReceivedMessage } from '$lib/server/api/communications/whatsapp/received_messages';
import { create as createInteraction } from '$lib/server/api/people/interactions';
import { create as createInteractionSchema } from '$lib/schema/people/interactions';
import { getPersonOrCreatePersonByWhatsappId } from '$lib/server/api/people/people';
import { triggerAction } from '$lib/schema/communications/actions/actions';
import { registerPersonForEventFromWhatsApp } from '$lib/server/api/events/attendees';
import { signPetition } from '$lib/server/api/petitions/signatures.js';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type === 'whatsapp.inbound_message.received') {
			// We need to create the person if we cannot find them by whatsapp ID. A person
			// is required for event and petition signups
			const person = await getPersonOrCreatePersonByWhatsappId(
				event.locals.instance.id,
				parsed.whatsappInboundMessage.from,
				parsed.whatsappInboundMessage,
				event.locals.queue
			);
			const receivedMessageToCreate = {
				person_id: person.id,
				message_id: parsed.whatsappInboundMessage.id,
				message: parsed.whatsappInboundMessage
			};
			const receivedMessage = await createReceivedMessage({
				instanceId: event.locals.instance.id,
				body: receivedMessageToCreate,
				t: event.locals.t
			});
			const message = parsed.whatsappInboundMessage;
			// generate an inbound_whatsapp artifact to save in the database
			const interaction = {
				person_id: person.id,
				admin_id: event.locals.admin.id,
				details: {
					type: 'inbound_whatsapp',
					message_id: receivedMessage.id,
					message: parsed.whatsappInboundMessage //this is the message object.
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
					if (message.button && message.button.payload) {
						const payload = message.button.payload; //this is the uuid of the action...
						const actionParsed = parse(triggerAction, {
							type: 'whatsapp_message',
							person_id: person.id,
							received_whatsapp_message_id: receivedMessage.id,
							action_id: payload,
							data: message
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
			} else if (message.type === 'interactive') {
				try {
					if (message.interactive && message.interactive.button_reply) {
						const payload = message.interactive.button_reply.id; //this is the uuid of the action...

						const actionParsed = parse(triggerAction, {
							type: 'whatsapp_message',
							person_id: person.id,
							received_whatsapp_message_id: receivedMessage.id,
							action_id: payload,
							data: message
						});
						log.debug(actionParsed, 'handling incoming interactive message');
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
			} else if (message.type === 'text') {
				// Pick out the string [SIGNUP:3] in the message
				// and split it into SIGNUP and 3.
				if (!message.text) {
					throw new Error('No message text found');
				}
				const pattern = /\[(SIGNUP|PETITION):([0-9]+)\]/;
				const identifier = pattern.exec(message.text.body);
				if (!identifier) {
					throw new Error('No identifier found');
				}
				const action = identifier[1]; // "SIGNUP" or "PETITION"
				const id = identifier[2]; // The numeric ID
				switch (action) {
					case 'SIGNUP':
						registerPersonForEventFromWhatsApp(
							id,
							message,
							event.locals.admin.id,
							event.locals.t,
							event.locals.queue
						);
						break;
					case 'PETITION':
						signPetition(id, message, event.locals.admin.id, event.locals.t, event.locals.queue);
						break;
					default:
						return error(400, 'WORKER:/webhooks/whatsapp/+server.ts', 'Unknown action');
				}
			}
		}
		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/webhooks/whatsapp/+server.ts', m.spry_ago_baboon_cure(), err);
	}
}
