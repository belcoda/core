import { json, error } from '$lib/server';
import { create, listForThread } from '$lib/server/api/communications/whatsapp/sends';
import * as m from '$lib/paraglide/messages';
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
			'API:/api/v1/communications/whatsapp/threads/[thread_id]/sends/+server.ts:GET',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function POST(event) {
	try {
		const threadId = Number(event.params.thread_id);
		const body = await event.request.json();
		console.log(body);
		const send = await create({
			instanceId: event.locals.instance.id,
			threadId,
			queue: event.locals.queue,
			adminId: event.locals.admin.id,
			body: body,
			t: event.locals.t
		});
		return json(send);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/whatsapp/threads/[thread_id]/sends/+server.ts:POST',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
