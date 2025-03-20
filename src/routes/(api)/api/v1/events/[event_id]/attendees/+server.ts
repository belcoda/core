import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/events/attendees';
import * as schema from '$lib/schema/events/attendees';
import { parse } from '$lib/schema/valibot';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import { read as readEvent } from '$lib/server/api/events/events';
const log = pino(import.meta.url);
export async function GET(event) {
	try {
		const response = await api.listForEvent({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			url: event.url,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/events/[event_id]/attendees:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		log.debug(body);
		const parsed = parse(schema.create, body);
		const response = await api.create({
			instanceId: event.locals.instance.id,
			body: parsed,
			t: event.locals.t,
			eventId: Number(event.params.event_id),
			queue: event.locals.queue
		});
		const eventObject = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			t: event.locals.t
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: response.person_id,
			adminId: event.locals.admin.id,
			details: {
				type: 'registered_for_event',
				method: 'manual',
				event_id: eventObject.id,
				event_name: eventObject.name
			},
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/events/[event_id]/attendees:POST',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
