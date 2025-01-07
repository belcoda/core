import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/website/content';

export async function GET(event) {
	try {
		const read = await api.read({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			contentTypeId: Number(event.params.content_type_id),
			contentId: Number(event.params.content_id)
		});
		return json(read);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/content_types/[content_type_id]/content/[content_id]:GET01',
			event.locals.t.errors.http[500](),
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
			contentId: Number(event.params.content_id),
			t: event.locals.t,
			body,
			queue: event.locals.queue
		});
		return json(update);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/content_types/[content_type_id]/content/[content_id]:PUT01',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
