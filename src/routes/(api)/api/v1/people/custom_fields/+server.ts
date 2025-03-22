import { create } from '$lib/schema/people/custom_fields';
import * as api from '$lib/server/api/people/custom_fields';
import { error, json } from '$lib/server';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const customFields = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(customFields);
	} catch (err) {
		return error(500, 'API:/people/custom_fields:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = v.parse(v.looseObject({ ...create.entries }), body); //for some reason, slug is getting stripped...
		const customField = await api.create({
			instance_id: event.locals.instance.id,
			body: parsed,
			t: event.locals.t
		});
		return json(customField);
	} catch (err) {
		return error(500, 'API:/people/custom_fields:POST:01', m.spry_ago_baboon_cure(), err);
	}
}
