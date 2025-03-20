import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/communications/email/messages';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const read = await api.read({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			messageId: Number(event.params.message_id)
		});
		return json(read);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/messages/[message_id]:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const generatePreview =
			event.url.searchParams.get('generatePreview') === 'false' ? false : true;
		const body = await event.request.json();
		const updated = await api.update({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			messageId: Number(event.params.message_id),
			body,
			queue: event.locals.queue
		});
		return json(updated);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/messages/[message_id]:PUT01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
