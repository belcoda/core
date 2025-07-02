import { json, error, pino, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
const log = pino(import.meta.url);

import * as m from '$lib/paraglide/messages';

import { read as readPerson } from '$lib/server/api/people/people';
import { _getByAction } from '$lib/server/api/communications/whatsapp/messages.js';
import { _idempotentUpdateExpiryTime } from '$lib/server/api/communications/whatsapp/conversations.js';

import {
	update as updateSentMessage,
	_getSentWhatsappMessageById
} from '$lib/server/api/communications/whatsapp/sent_messages';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type !== 'whatsapp.message.updated') {
			throw new Error('Invalid webhook type. Not whatsapp.message.updated');
		}

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
				log.error(parsed.whatsappMessage, `Sent whatsApp message with id ${sentMessageId} failed.`);
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
