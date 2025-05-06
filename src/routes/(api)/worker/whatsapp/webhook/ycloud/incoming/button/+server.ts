import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
import { triggerAction } from '$lib/schema/communications/actions/actions';

import { type Create as CreateReceivedMessage } from '$lib/schema/communications/whatsapp/received_whatsapp_messages';

import { getPersonOrCreatePersonByWhatsappId } from '$lib/server/api/people/people';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type !== 'whatsapp.inbound_message.received') {
			throw new Error('Invalid webhook type');
		}
		if (parsed.whatsappInboundMessage.type !== 'button') {
			throw new Error('Invalid button type');
		}

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

		const message = parsed.whatsappInboundMessage;
		if (message.button && message.button.payload) {
			const payload = message.button.payload; //this is the uuid of the action...
			const actionParsed = parse(triggerAction, {
				type: 'whatsapp_message',
				person_id: person.id,
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

		return json({ success: true });
	} catch (err) {
		log.error(err);
		return error(
			500,
			'WORKER:/whatsapp/webhooks/ycloud/incoming/button/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
