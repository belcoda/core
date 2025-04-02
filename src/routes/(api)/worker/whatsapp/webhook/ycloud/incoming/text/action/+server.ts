import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';
import { yCloudWebhook } from '$lib/schema/communications/whatsapp/webhooks/ycloud';

import { extractCodeFromMessage } from '$lib/server/hooks/whatsapp/ycloud';

import { registerPersonForEventFromWhatsApp } from '$lib/server/api/events/attendees';
import { signPetition } from '$lib/server/api/petitions/signatures';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(yCloudWebhook, body);
		if (parsed.type !== 'whatsapp.inbound_message.received') {
			throw new Error('Invalid webhook type');
		}
		const { action, id } = extractCodeFromMessage(parsed);
		switch (action) {
			case 'SIGNUP': {
				await registerPersonForEventFromWhatsApp(
					id,
					parsed.whatsappInboundMessage,
					event.locals.admin.id,
					event.locals.t,
					event.locals.queue
				);
				break;
			}
			case 'PETITION': {
				await signPetition(
					id,
					parsed.whatsappInboundMessage,
					event.locals.admin.id,
					event.locals.t,
					event.locals.queue
				);
				break;
			}
			default: {
				//shouldn't be possible
				throw new Error('Error in action handler: Unknown action');
			}
		}
		//we've processed the actions, now we need to queue processing the message just like any other random text message...
		await event.locals.queue(
			'/whatsapp/webhook/ycloud/incoming/text',
			event.locals.instance.id,
			parsed
		);
		return json({ success: true });
	} catch (err) {
		log.error(err);
		return error(
			500,
			'WORKER:/whatsapp/webhooks/ycloud/incoming/text/action/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
