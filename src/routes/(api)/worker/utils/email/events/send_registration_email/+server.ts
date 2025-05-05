import { json, error, pino } from '$lib/server';
import { triggerEventMessage, sendEventEmailMessage } from '$lib/schema/utils/email';
import { read as readPerson } from '$lib/server/api/people/people';
import { read as readEvent } from '$lib/server/api/events/events';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerEventMessage, body);
		const eventResponse = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: parsed.event_id
		});

		if (eventResponse.send_registration_email === false) {
			return json({ success: true, message: 'No registration email required' });
		}

		const personResponse = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id
		});

		const messageResponse = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: eventResponse.registration_email.id,
			t: event.locals.t
		});

		const sendToQueue = {
			instance: event.locals.instance,
			person: personResponse,
			event: eventResponse,
			email: messageResponse
		};
		const parsedSendToQueue = parse(sendEventEmailMessage, sendToQueue);
		await event.locals.queue(
			'utils/email/send_event_email',
			event.locals.instance.id,
			parsedSendToQueue,
			event.locals.admin.id
		);
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: personResponse.id,
			adminId: event.locals.admin.id,
			details: {
				type: 'received_event_registration_email',
				event_id: eventResponse.id,
				event_name: eventResponse.name,
				message_id: messageResponse.id
			},
			queue: event.locals.queue
		});
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/events/send_registration_email:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}
