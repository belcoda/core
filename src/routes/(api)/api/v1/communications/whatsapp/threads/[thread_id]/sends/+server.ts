import { json, error } from '$lib/server';
import { create, listForThread } from '$lib/server/api/communications/whatsapp/sends';

export async function GET(event) {
	try {
		const threadId = Number(event.params.thread_id);
		const sends = await listForThread({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t,
			threadId
		});
		return json(sends);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/whatsapp/threads/[thread_id]/send/+server.ts:GET',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function POST(event) {
	try {
		const threadId = Number(event.params.thread_id);
		const body = await event.request.json();
		const send = await create({
			instanceId: event.locals.instance.id,
			threadId,
			queue: event.locals.queue,
			adminId: event.locals.admin.id,
			body: body
		});
		return json(send);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/whatsapp/threads/[thread_id]/send/+server.ts:POST',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
