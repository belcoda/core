import { json, error, pino, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import {
	yCloudWebhook,
	type WhatsappInboundMessage
} from '$lib/schema/communications/whatsapp/webhooks/ycloud';
const log = pino('WORKER:/webhooks/whatsapp/+server.ts');

import { create as createReceivedMessage } from '$lib/server/api/communications/whatsapp/received_messages';
import { create as createInteraction } from '$lib/server/api/people/interactions';
import { create as createInteractionSchema } from '$lib/schema/people/interactions';
import { _createPersonByWhatsappId, _getPersonByWhatsappId } from '$lib/server/api/people/people';
import { triggerAction } from '$lib/schema/communications/actions/actions';
import {
	_getInstanceIdByEventId,
	_getInstanceIdByPetitionId
} from '$lib/server/api/core/instances.js';
import type { RequestEvent } from './$types.js';
import { signatureQueueMessage } from '$lib/schema/petitions/petitions.js';
import type { Read as Instance } from '$lib/schema/core/instance.js';
import { signUpQueueMessage, type SignupQueueMessage } from '$lib/schema/events/events.js';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type === 'whatsapp.inbound_message.received') {
			//const contact = value.contacts[index];
			const person = await getPerson(
				event.locals.instance.id,
				parsed.whatsappInboundMessage.from,
				parsed.whatsappInboundMessage,
				event
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
							queueMessage: getSignupQueueMessage(payload, message, event.locals.instance)
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
						registerPersonForEvent(id, message, event);
						break;
					case 'PETITION':
						signPetition(id, message, event);
						break;
					default:
						return error(400, 'WORKER:/webhooks/whatsapp/+server.ts', 'Unknown action');
				}
			}
		}
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/webhooks/whatsapp/+server.ts',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

async function registerPersonForEvent(
	eventId: string,
	message: WhatsappInboundMessage,
	event: RequestEvent
) {
	const instance = await _getInstanceIdByEventId(eventId);
	const person = await getPerson(instance.id, message.from, message, event);

	if (person) {
		// Send to events/registration queue
		const parsed = parse(signUpQueueMessage, {
			event_id: Number(eventId),
			signup: {
				full_name: message.customerProfile?.name,
				phone_number: message.from,
				country: instance.country,
				message: message,
				email: null,
				opt_in: true
			}
		});
		await event.locals.queue('/events/registration', instance.id, parsed, event.locals.admin.id);
	}
}

async function getPerson(
	instanceId: number,
	whatsappId: string,
	message: WhatsappInboundMessage,
	event: RequestEvent
) {
	try {
		return await _getPersonByWhatsappId({
			instanceId,
			whatsappId,
			t: event.locals.t
		});
	} catch (err) {
		if (err instanceof BelcodaError && err.code === 404) {
			log.debug('Person not found by whatsappId. Creating person');
			return await _createPersonByWhatsappId({
				instanceId,
				whatsappId,
				name: message.customerProfile?.name,
				t: event.locals.t,
				queue: event.locals.queue
			});
		} else {
			throw err;
		}
	}
}

async function signPetition(
	petitionId: string,
	message: WhatsappInboundMessage,
	event: RequestEvent
) {
	const instance = await _getInstanceIdByPetitionId(petitionId);
	const person = await getPerson(instance.id, message.from, message, event);

	if (person) {
		const parsed = parse(signatureQueueMessage, {
			petition_id: Number(petitionId),
			signup: {
				full_name: message.customerProfile?.name,
				phone_number: message.from,
				country: instance.country,
				whatsapp_id: message.from,
				whatsapp_message_id: message.id,
				message: message,
				opt_in: true,
				email: 'kenneth@belcoda.org' // TODO: String expected. Handle this
			}
		});
		console.log('parsed ', parsed);
		await event.locals.queue('/petitions/signature', instance.id, parsed, event.locals.admin.id);
	}
}

function getSignupQueueMessage(
	eventId: string,
	message: WhatsappInboundMessage,
	instance: Instance
): SignupQueueMessage {
	return {
		event_id: Number(eventId),
		signup: {
			full_name: message.customerProfile?.name,
			phone_number: message.from,
			country: instance.country,
			opt_in: true,
			email: null
		}
	};
}
