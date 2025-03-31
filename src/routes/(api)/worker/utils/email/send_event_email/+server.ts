import { json, error, pino } from '$lib/server';
import {
	sendEventEmailMessage,
	sendEmailMessage,
	type SendEmailMessage
} from '$lib/schema/utils/email';
import renderEmail from '$lib/server/utils/handlebars/render_email';
import { read } from '$lib/server/api/communications/email/templates';
const log = pino(import.meta.url);
import { randomUUID } from 'crypto';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendEventEmailMessage, body);
		const sentEmailId = randomUUID();

		const template = await read({
			instanceId: event.locals.instance.id,
			templateId: parsed.email.template_id,
			t: event.locals.t
		});

		// handlebars the templates...

		const renderedHtml = await renderEmail({
			emailUnsubscribeToken: sentEmailId,
			messageTemplate: parsed.email.html,
			templateTemplate: template.html,
			instanceId: event.locals.instance.id,
			context: { event: parsed.event, person: parsed.person, instance: parsed.instance },
			t: event.locals.t
		});
		const renderedText = parsed.email.use_html_for_plaintext
			? renderedHtml
			: await renderEmail({
					emailUnsubscribeToken: sentEmailId,
					messageTemplate: parsed.email.text,
					templateTemplate: template.text,
					instanceId: event.locals.instance.id,
					context: { event: parsed.event, person: parsed.person, instance: parsed.instance },
					t: event.locals.t
				});
		const sendToQueue: SendEmailMessage = {
			person_id: parsed.person.id,
			email: { ...parsed.email, html: renderedHtml, text: renderedText },
			sent_email_id: sentEmailId,
			email_message_id: parsed.email.id
		};
		const parsedSendToQueue = parse(sendEmailMessage, sendToQueue);
		await event.locals.queue(
			'utils/email/send_email',
			event.locals.instance.id,
			parsedSendToQueue,
			event.locals.admin.id
		);
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/send_event_email:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}
