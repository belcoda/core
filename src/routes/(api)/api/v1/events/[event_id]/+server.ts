import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/events/events';
import * as schema from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

export async function GET(event) {
	try {
		const response = await api.read({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events/[event_id]:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const response = await api.update({
			instanceId: event.locals.instance.id,
			eventId: Number(event.params.event_id),
			body: body,
			queue: event.locals.queue,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events/[event_id]:PUT', m.spry_ago_baboon_cure(), err);
	}
}
