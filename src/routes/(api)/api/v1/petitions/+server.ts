import { json, pino, error } from '$lib/server';
import * as api from '$lib/server/api/petitions/petitions';
import * as schema from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function GET(event) {
	try {
		const response = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/petitions:GET', event.locals.t.errors.http[500](), err);
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
			adminId: event.locals.admin.id,
			t: event.locals.t,
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/petitions:POST', event.locals.t.errors.http[500](), err);
	}
}
