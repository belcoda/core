import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';
import { create } from '$lib/schema/communications/whatsapp/received_whatsapp_messages';
import { create as createInteractionSchema } from '$lib/schema/people/interactions';

import { create as createReceivedMessage } from '$lib/server/api/communications/whatsapp/received_messages';
import { create as createInteraction } from '$lib/server/api/people/interactions';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(create, body);
		const receivedMessage = await createReceivedMessage({
			instanceId: event.locals.instance.id,
			body: parsed,
			t: event.locals.t
		});
		log.debug(`Received message created: ${receivedMessage.id}`);

		// generate an inbound_whatsapp artifact to save in the database
		const interaction = {
			person_id: receivedMessage.person_id,
			admin_id: event.locals.admin.id,
			details: {
				type: 'inbound_whatsapp',
				message_id: receivedMessage.id,
				message: receivedMessage.message //this is the message object.
			}
		};
		const interactionParsed = parse(createInteractionSchema, interaction);

		await createInteraction({
			instanceId: event.locals.instance.id,
			body: interactionParsed,
			t: event.locals.t
		});

		return json({ success: true });
	} catch (err) {
		log.error(err);
		return error(
			500,
			'WORKER:/whatsapp/received_message/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
