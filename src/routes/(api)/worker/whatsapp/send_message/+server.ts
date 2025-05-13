import { json, pino } from '$lib/server';
import { randomUUID } from 'crypto';

import { parse } from '$lib/schema/valibot';
import { sendMessage } from '$lib/schema/communications/whatsapp/elements/message';

import { read as readMessage } from '$lib/server/api/communications/whatsapp/messages';
import { _readSecretsUnsafe } from '$lib/server/api/core/instances';
import { _updateWhatsappId, read as readPerson } from '$lib/server/api/people/people';
import { create as createSentMessage } from '$lib/server/api/communications/whatsapp/sent_messages';
import { _getThreadByStartingMessageId } from '$lib/server/api/communications/whatsapp/threads';

import * as actions from './actions';

import { PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER } from '$env/static/public';

const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsedMessage = parse(sendMessage, body);

		const phoneNumber =
			event.locals.instance.settings.communications.whatsapp.phone_number ||
			PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER;

		const person = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsedMessage.person_id
		});

		const message = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: parsedMessage.message_id
		});

		const sentMessageId = randomUUID();

		const response = await actions.sendMessageToYCloud({
			person,
			message,
			phoneNumber,
			instanceId: event.locals.instance.id,
			sentMessageId
		});

		//updates the whatsapp ID of the user, confirming they have a phone number that is connected to WhatsApp.
		await _updateWhatsappId({
			instanceId: event.locals.instance.id,
			personId: parsedMessage.person_id,
			whatsappId: response.to
		});

		//TODO: Handle situations where message.message_status is not 'accepted', but rather sent for quality evaulation. The sent message should make that very clear
		const sentMessageResponse = await createSentMessage({
			instanceId: event.locals.instance.id,
			body: {
				id: sentMessageId,
				person_id: parsedMessage.person_id,
				message_id: parsedMessage.message_id,
				message: message.message,
				wamid: response.wamid || 'NO_WAMID_PROVIDED'
			},
			t: event.locals.t
		});

		//If the message has a "next message" set, that means after sending this message, we need to send the following one int he chain
		await actions.sendNextMessageIfExists({
			adminId: parsedMessage.from_admin_id,
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			message: message,
			personId: parsedMessage.person_id,
			queue: event.locals.queue
		});

		// create interaction
		await actions.recordInteraction({
			message,
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			adminId: parsedMessage.from_admin_id,
			personId: parsedMessage.person_id,
			sentMessageId: sentMessageResponse.id
		});
	} catch (err) {
		log.error(err, 'Error sending WhatsApp message');
	} finally {
		return json({ success: true });
	}
}
