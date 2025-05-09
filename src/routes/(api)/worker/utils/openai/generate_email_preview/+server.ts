import { json, error } from '$lib/server';
import { generateEmailPreview } from '$lib/server/utils/openai/schemas/emailPreview';
import { emailPreviewOptions } from '$lib/schema/utils/openai';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import {
	read as readMessage,
	update as updateMessage
} from '$lib/server/api/communications/email/messages';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(emailPreviewOptions, body);
		const message = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: parsed.emailMessageId
		});
		const { preview } = await generateEmailPreview(message.subject, message.html);
		await updateMessage({
			instanceId: event.locals.instance.id,
			messageId: parsed.emailMessageId,
			body: { preview_text: preview },
			queue: event.locals.queue
		});
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/worker/utils/openai/generate_html_meta/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
