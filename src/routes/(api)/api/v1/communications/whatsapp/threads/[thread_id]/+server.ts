import { error, json } from '$lib/server';
import * as api from '$lib/server/api/communications/whatsapp/threads';

export async function GET(event) {
	try {
		const itemId = Number(event.params.thread_id);
		const result = await api.read({
			instanceId: event.locals.instance.id,
			threadId: itemId,
			t: event.locals.t
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/threads/[thread_id]:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const itemId = Number(event.params.thread_id);
		const result = await api.update({
			threadId: itemId,
			t: event.locals.t,
			instanceId: event.locals.instance.id,
			body: body
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/threads/[thread_id]:PUT',
			event.locals.t.errors.http[500](),
			err
		);
	}
}