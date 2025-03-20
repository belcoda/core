import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/petitions/petitions';
import * as schema from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function GET(event) {
	try {
		const response = await api.read({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/petitions/[petitions_id]:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const response = await api.update({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			body: body,
			t: event.locals.t,
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/petitions/[petition_id]:PUT',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
