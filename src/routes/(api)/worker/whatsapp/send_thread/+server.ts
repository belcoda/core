import { json, error, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/whatsapp/sends';
import { parse } from '$lib/schema/valibot';
import { getAllPersonIds } from '$lib/server/api/people/lists';
import * as m from '$lib/paraglide/messages';
import { read as readThread } from '$lib/server/api/communications/whatsapp/threads';
import { update as updateSentMessage } from '$lib/server/api/communications/whatsapp/sends';
import { type SendMessage } from '$lib/schema/communications/whatsapp/elements/message';
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.read, body);
		if (parsed.completed_at)
			throw new BelcodaError(400, 'WORKER:/whatsapp/send_thread:01', m.stock_minor_barbel_zip());

		const list = await getAllPersonIds({
			instanceId: event.locals.instance.id,
			listId: parsed.list.id,
			t: event.locals.t
		});

		const thread = await readThread({
			instanceId: event.locals.instance.id,
			threadId: parsed.thread_id,
			t: event.locals.t
		});

		for (let index = 0; index < list.length; index++) {
			const sendMessageBody: SendMessage = {
				message_id: thread.template_message_id,
				person_id: list[index],
				from_admin_id: parsed.sent_by_id
			};
			await event.locals.queue(
				'/whatsapp/send_message',
				event.locals.instance.id,
				sendMessageBody,
				event.locals.admin.id
			);
		}

		await updateSentMessage({
			instanceId: event.locals.instance.id,
			sendId: parsed.id,
			threadId: parsed.thread_id,
			body: { completed_at: new Date() },
			t: event.locals.t
		});

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/whatsapp/send_thread:01', m.spry_ago_baboon_cure(), err);
	}
}
