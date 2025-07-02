import { error, json } from '$lib/server';
import { sendTestEmail } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import { read } from '$lib/server/api/communications/email/messages';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		//make sure the message is the latest info
		const message = await read({
			instanceId: event.locals.instance.id,
			messageId: Number(event.params.message_id)
		});
		const parsed = parse(sendTestEmail, { ...body, message });
		await event.locals.queue(
			'/utils/email/send_test_email',
			event.locals.instance.id,
			parsed,
			event.locals.admin.id
		);
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/messages/[message_id]:PUT01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
