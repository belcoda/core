import * as schema from '$lib/schema/core/tags';
import { parse } from '$lib/schema/valibot';
import * as api from '$lib/server/api/core/tags';
import { json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const list = await api.list({ instanceId: event.locals.instance.id, url: event.url });
		return json(list);
	} catch (err) {
		return error(500, 'API:/api/v1/tags:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.create, body);
		const created = await api.create({ instanceId: event.locals.instance.id, body: parsed });
		return json(created);
	} catch (err) {
		return error(500, 'API:/api/v1/tags:POST', m.spry_ago_baboon_cure(), err);
	}
}
