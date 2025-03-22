import { json, error, pino, BelcodaError } from '$lib/server';
import {
	sendEventEmailMessage,
	sendEmailMessage,
	type SendEmailMessage,
	sendEmailToListSchema
} from '$lib/schema/utils/email';
const log = pino(import.meta.url);
import { getAllPersonIds } from '$lib/server/api/people/lists';
import { markAsStarted } from '$lib/server/api/communications/email/sends';
import { randomUUID } from 'crypto';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
import { read as readTemplate } from '$lib/server/api/communications/email/templates';
import { read as readPerson } from '$lib/server/api/people/people';
import renderEmail from '$lib/server/utils/handlebars/render_email';
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendEmailToListSchema, body);
		const send = await markAsStarted({
			instanceId: event.locals.instance.id,
			sendId: parsed.send_id,
			t: event.locals.t
		});
		const message = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: send.message_id,
			t: event.locals.t
		});
		const template = await readTemplate({
			instanceId: event.locals.instance.id,
			templateId: message.template_id,
			t: event.locals.t
		});
		if (!send.list_id)
			throw new BelcodaError(
				400,
				'WORKER:/utils/email/send_to_list:01',
				m.teary_dizzy_earthworm_urge()
			);
		const ids = await getAllPersonIds({
			instanceId: event.locals.instance.id,
			listId: send.list_id,
			t: event.locals.t
		});
		for (let index = 0; index < ids.length; index++) {
			const id = ids[index];
			const uuid = randomUUID();
			const person = await readPerson({
				instance_id: event.locals.instance.id,
				person_id: id,
				t: event.locals.t
			});

			const renderedHtml = await renderEmail({
				emailUnsubscribeToken: uuid,
				messageTemplate: message.html,
				templateTemplate: template.html,
				instanceId: event.locals.instance.id,
				context: { person: person, instance: event.locals.instance },
				t: event.locals.t
			});
			const renderedText = message.use_html_for_plaintext
				? renderedHtml
				: await renderEmail({
						emailUnsubscribeToken: uuid,
						messageTemplate: message.text,
						templateTemplate: template.text,
						instanceId: event.locals.instance.id,
						context: { person: person, instance: event.locals.instance },
						t: event.locals.t
					});
			//if it's the last message to send, we want to mark the send as finished...
			const sendToQueue: SendEmailMessage =
				index === ids.length - 1
					? {
							person_id: person.id,
							email: { ...message, html: renderedHtml, text: renderedText },
							sent_email_id: uuid,
							email_message_id: message.id,
							finish_send_id: send.id
						}
					: {
							person_id: person.id,
							email: { ...message, html: renderedHtml, text: renderedText },
							sent_email_id: uuid,
							email_message_id: message.id
						};
			const parsedSendToQueue = parse(sendEmailMessage, sendToQueue);
			await event.locals.queue(
				'utils/email/send_email',
				event.locals.instance.id,
				parsedSendToQueue,
				event.locals.admin.id
			);
		}

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/utils/email/send_to_list:01', m.teary_dizzy_earthworm_urge(), err);
	}
}
