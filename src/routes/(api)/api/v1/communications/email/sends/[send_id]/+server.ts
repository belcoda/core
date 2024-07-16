import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/communications/email/sends';

export async function GET(event) {
	try {
		const read = await api.read({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			sendId: Number(event.params.send_id)
		});
		return json(read);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends/[send_id]:GET01',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const updated = await api.update({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			sendId: Number(event.params.send_id),
			body
		});
		return json(updated);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends/[send_id]:PUT01',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
