import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';

import { create as createReceivedMessage } from '$lib/server/api/communications/whatsapp/received_messages';
import { type Create as CreateReceivedMessage } from '$lib/schema/communications/whatsapp/received_whatsapp_messages';

import { getPersonOrCreatePersonByWhatsappId } from '$lib/server/api/people/people';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type !== 'whatsapp.inbound_message.received') {
			throw new Error('Invalid webhook type');
		}

		//let's try to get the person id from the from field;
		const from = parsed.whatsappInboundMessage.from;
		const person = await getPersonOrCreatePersonByWhatsappId(
			event.locals.instance.id,
			from,
			parsed.whatsappInboundMessage,
			event.locals.t,
			event.locals.queue
		).catch((err) => {
			log.error(
				err,
				'Unable to getOrCreate person by whatsapp ID in incoming text message handler'
			);
			throw new Error('Error getting person by whatsapp ID');
		});

		const receivedMessageBody: CreateReceivedMessage = {
			person_id: person.id,
			message: parsed.whatsappInboundMessage,
			conversation_id: null,
			reacted: false,
			reacted_emoji: null
		};
		await event.locals.queue(
			'/whatsapp/received_message',
			event.locals.instance.id,
			receivedMessageBody
		);

		return json({ success: true });
	} catch (err) {
		log.error(err);
		return error(
			500,
			'WORKER:/whatsapp/webhooks/ycloud/incoming/text/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
