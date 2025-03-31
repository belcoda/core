import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/website/content_types';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const read = await api.read({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			contentTypeId: Number(event.params.content_type_id)
		});
		return json(read);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/content_types/[content_type_id]:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const update = await api.update({
			instanceId: event.locals.instance.id,
			contentTypeId: Number(event.params.content_type_id),
			body
		});
		return json(update);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/content_types/[content_type_id]:PUT01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
