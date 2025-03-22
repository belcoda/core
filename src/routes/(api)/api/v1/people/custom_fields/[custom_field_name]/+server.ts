import { update } from '$lib/schema/people/custom_fields';
import * as api from '$lib/server/api/people/custom_fields';
import { error, json } from '$lib/server';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const customFields = await api.read({
			instance_id: event.locals.instance.id,
			custom_field_name: event.params.custom_field_name,
			t: event.locals.t
		});
		return json(customFields);
	} catch (err) {
		return error(
			500,
			'API:/people/custom_fields/[custom_field_id]:GET:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = v.parse(update, body); //for some reason, slug is getting stripped...
		const customField = await api.update({
			instanceId: event.locals.instance.id,
			customFieldName: event.params.custom_field_name,
			body: parsed,
			t: event.locals.t
		});
		return json(customField);
	} catch (err) {
		return error(
			500,
			'API:/people/custom_fields/[custom_field_id]:PUT:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
