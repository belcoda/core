import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/events/attendees';
import * as schema from '$lib/schema/events/attendees';
import { parse } from '$lib/schema/valibot';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import { read as readEvent } from '$lib/server/api/events/events';

const log = pino(import.meta.url);

export async function GET(event) {
	try {
		const response = await api.read({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			personId: Number(event.params.person_id),
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/events/[event_id]/attendees/[person_id]:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.update, body);
		const response = await api.update({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			personId: Number(event.params.person_id),
			queue: event.locals.queue,
			body: parsed,
			t: event.locals.t
		});
		const eventObject = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			t: event.locals.t
		});
		if (response.status === 'cancelled') {
			await queueInteraction({
				instanceId: event.locals.instance.id,
				personId: response.person_id,
				adminId: event.locals.admin.id,
				details: {
					type: 'cancelled_event_registration',
					method: 'manual',
					event_id: eventObject.id,
					event_name: eventObject.name
				},
				queue: event.locals.queue
			});
		}
		if (response.status === 'noshow') {
			await queueInteraction({
				instanceId: event.locals.instance.id,
				personId: response.person_id,
				adminId: event.locals.admin.id,
				details: {
					type: 'noshow_event',
					event_id: eventObject.id,
					event_name: eventObject.name
				},
				queue: event.locals.queue
			});
		}
		if (response.status === 'attended') {
			await queueInteraction({
				instanceId: event.locals.instance.id,
				personId: response.person_id,
				adminId: event.locals.admin.id,
				details: {
					type: 'attended_event',
					event_id: eventObject.id,
					event_name: eventObject.name
				},
				queue: event.locals.queue
			});
		}
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/events/[event_id]/attendees/[person_id]:PUT',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
