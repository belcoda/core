import { json, error, pino } from '$lib/server';
import { triggerEventMessage, sendEventEmailMessage } from '$lib/schema/utils/email';
import { read as readPerson } from '$lib/server/api/people/people';
import { read as readEvent } from '$lib/server/api/events/events';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
const log = pino(import.meta.url);
import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerEventMessage, body);
		const eventResponse = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: parsed.event_id,
			t: event.locals.t
		});

		if (eventResponse.send_followup_email === false) {
			return json({ success: true, message: 'No followup email required' });
		}

		const personResponse = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			t: event.locals.t
		});

		const messageResponse = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: eventResponse.followup_email.id,
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
				type: 'received_event_followup_email',
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
			'WORKER:/utils/email/events/send_followup_email:01',
			event.locals.t.errors.generic(),
			err
		);
	}
}
