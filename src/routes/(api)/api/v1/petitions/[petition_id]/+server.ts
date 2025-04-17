import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/petitions/petitions';
import * as schema from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

export async function GET(event) {
	try {
		const response = await api.read({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id)
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/petitions/[petitions_id]:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const response = await api.update({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			body: body,
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/petitions/[petition_id]:PUT', m.spry_ago_baboon_cure(), err);
	}
}

export async function DELETE(event) {
	try {
		const response = await api.del({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id)
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/petitions/[petition_id]:DELETE', m.spry_ago_baboon_cure(), err);
	}
}
