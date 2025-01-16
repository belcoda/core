import { json, error } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { update } from '$lib/schema/core/instance';
import { update as updateApi } from '$lib/server/api/core/instances';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(update, body);
		const updated = await updateApi({
			instanceId: event.locals.instance.id,
			body: parsed,
			t: event.locals.t
		});
		return json(updated);
	} catch (err) {
		return error(500, 'API:/settings/organization:PUT', event.locals.t.errors.http[500](), err);
	}
}
