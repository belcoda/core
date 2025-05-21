import { json, error } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { update } from '$lib/schema/core/instance';
import { update as updateApi } from '$lib/server/api/core/instances';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(update, body);
		const updated = await updateApi({
			instanceId: event.locals.instance.id,
			body: parsed
		});
		return json(updated);
	} catch (err) {
		return error(500, 'API:/settings/organization:PUT', m.spry_ago_baboon_cure(), err);
	}
}
