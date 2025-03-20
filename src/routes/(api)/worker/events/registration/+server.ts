import { BelcodaError, json, error, pino } from '$lib/server';
import { signUpQueueMessage } from '$lib/schema/events/events';
import { triggerEventMessage } from '$lib/schema/utils/email';
import { parse } from '$lib/schema/valibot';
import updatePerson from '$lib/server/hooks/website/utils/update_person';
import { create } from '$lib/server/api/events/attendees.js';
import { read as readEvent } from '$lib/server/api/events/events';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(signUpQueueMessage, {
			event_id: body.event_id,
			signup: body.signup
		});
		const eventObject = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: parsed.event_id,
			t: event.locals.t
		});
		const person = await updatePerson({
			instanceId: event.locals.instance.id,
			signup: parsed.signup,
			adminId: event.locals.admin.id,
			country: event.locals.instance.country,
			t: event.locals.t,
			type: {
				method: 'event_registration',
				event_id: parsed.event_id,
				event_name: eventObject.name
			},
			queue: event.locals.queue
		}).catch((err) => {
			throw new BelcodaError(
				400,
				'WORKER:/events/registration:01',
				m.teary_dizzy_earthworm_urge(),
				err
			);
		});

		await create({
			instanceId: event.locals.instance.id,
			eventId: parsed.event_id,
			queue: event.locals.queue,
			body: {
				person_id: person.id,
				send_notifications: true,
				status: 'registered'
			},
			t: event.locals.t
		});

		await queueInteraction({
			personId: person.id,
			adminId: event.locals.admin.id,
			instanceId: event.locals.instance.id,
			details: {
				type: 'registered_for_event',
				method: 'website',
				event_id: parsed.event_id,
				event_name: eventObject.name
			},
			queue: event.locals.queue
		});

		const sendToQueue = {
			event_id: parsed.event_id,
			person_id: person.id
		};
		const parsedSendToQueue = parse(triggerEventMessage, sendToQueue);
		await event.locals.queue(
			'utils/email/events/send_registration_email',
			event.locals.instance.id,
			parsedSendToQueue,
			event.locals.admin.id
		);

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/events/registration:02', m.teary_dizzy_earthworm_urge(), err);
	}
}
