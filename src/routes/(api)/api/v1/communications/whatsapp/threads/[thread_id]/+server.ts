import { error, json } from '$lib/server';
import * as api from '$lib/server/api/communications/whatsapp/threads';
import * as m from '$lib/paraglide/messages';
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
			m.spry_ago_baboon_cure(),
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
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const itemId = Number(event.params.thread_id);
		const result = await api.del({
			threadId: itemId,
			instanceId: event.locals.instance.id
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/threads/[thread_id]:DELETE',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
