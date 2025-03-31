import { POSTMARK_SERVER_TOKEN } from '$env/static/private';
import type { NumericRange } from '@sveltejs/kit';
import { BelcodaError, pino } from '$lib/server';
const log = pino(import.meta.url);
export default async function (options: {
	to: string;
	from: string;
	subject: string;
	html: string;
	text?: string | undefined;
	replyTo: string;
	stream: 'broadcast' | 'outbound';
	//returnPath: string;
}): Promise<string> {
	const result = await fetch('https://api.postmarkapp.com/email', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN
		},
		body: JSON.stringify({
			From: options.from,
			To: options.to,
			Subject: options.subject,
			HtmlBody: options.html,
			TextBody: options.text,
			ReplyTo: options.replyTo,
			MessageStream: options.stream
		})
	});
	if (!result.ok) {
		if (result.status === 422) {
			const json = await result.json();
			log.error(json);
		}
		const json = await result.json();
		log.error(json);
		throw new BelcodaError(
			result.status as NumericRange<400, 599>,
			'SERVER:UTILS:SEND_EMAIL_POSTMARK:01',
			'Failed to send email'
		);
	} else {
		const json = await result.json();
		log.info('Email sent successfully');
		log.info(json);
		return json.MessageID;
	}
}
