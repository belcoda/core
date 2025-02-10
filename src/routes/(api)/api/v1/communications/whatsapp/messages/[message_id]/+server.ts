import { error, json } from '$lib/server';
import * as api from '$lib/server/api/communications/whatsapp/messages';

export async function GET(event) {
	try {
		const result = await api.read({
			instanceId: event.locals.instance.id,
			messageId: event.params.message_id,
			t: event.locals.t
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/threads/[thread_id]/messages/[message_id]:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const messageId = event.params.message_id;
		const body = await event.request.json();
		const result = await api.update({
			instanceId: event.locals.instance.id,
			messageId: messageId,
			body,
			t: event.locals.t
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/messages/[message_id]:PUT',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
