import { BelcodaError, json, error, pino } from '$lib/server';
import { signUpQueueMessage } from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
import updatePerson from '$lib/server/hooks/website/utils/update_person';
import { create } from '$lib/server/api/events/attendees.js';
import { read as readEvent } from '$lib/server/api/events/events';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
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
				event.locals.t.errors.generic(),
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
				status: 'registered',
				response_channel: person.email ? 'email' : 'whatsapp' //TODO: use a criteria to determine what channel to send to
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

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/events/registration:02', event.locals.t.errors.generic(), err);
	}
}
