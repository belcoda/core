import * as schema from '$lib/schema/core/tags';
import { parse } from '$lib/schema/valibot';
import * as api from '$lib/server/api/core/tags';
import { json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const tagId = Number(event.params.tag_id);
		const read = await api.read({
			instanceId: event.locals.instance.id,
			tagId: tagId,
			t: event.locals.t
		});
		return json(read);
	} catch (err) {
		return error(500, 'API:/api/v1/tags/[tag_id]:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.update, body);
		const tagId = Number(event.params.tag_id);
		const updated = await api.update({
			instanceId: event.locals.instance.id,
			tagId: tagId,
			body: parsed,
			t: event.locals.t
		});
		return json(updated);
	} catch (err) {
		return error(500, 'API:/api/v1/tags/[tag_id]:PUT', m.spry_ago_baboon_cure(), err);
	}
}
