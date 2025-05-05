import { json, error, BelcodaError } from '$lib/server';
import { update, send as sendEmailToList } from '$lib/server/api/communications/email/sends';
import { sendToList } from '$lib/schema/communications/email/sends';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendToList, body);
		const send = await update({
			instanceId: event.locals.instance.id,
			sendId: Number(event.params.send_id),
			messageId: Number(event.params.message_id),
			body: parsed,
			t: event.locals.t
		});
		if (send.started_at || send.completed_at) {
			throw new BelcodaError(
				400,
				'API:/communications/email/sends/[send_id]/send:02',
				m.teary_dizzy_earthworm_urge()
			);
		}
		await sendEmailToList({
			instanceId: event.locals.instance.id,
			sendId: Number(event.params.send_id),
			messageId: Number(event.params.message_id),
			queue: event.locals.queue,
			adminId: event.locals.admin.id,
			t: event.locals.t
		});
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'API:/communications/email/sends/[send_id]/send:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
