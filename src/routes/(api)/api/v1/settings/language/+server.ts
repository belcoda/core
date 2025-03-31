import { update } from '$lib/server/api/core/instances';
import { json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const instanceId = event.locals.instance.id;
		const body = await event.request.json();
		const t = event.locals.t;
		const updated = await update({ instanceId, body, t });
		event.locals.instance = updated;
		return json(updated);
	} catch (e) {
		return error(500, 'API:/settings:PUT:01', m.spry_ago_baboon_cure(), e);
	}
}
