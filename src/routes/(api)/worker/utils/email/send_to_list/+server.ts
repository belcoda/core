import { json, error, pino, BelcodaError } from '$lib/server';
import { sendEmailToListSchema } from '$lib/schema/utils/email';
import { type EmailTemplateMessage } from '$lib/schema/communications/email/messages';
const log = pino(import.meta.url);
import { getAllPersonIds } from '$lib/server/api/people/lists';
import { markAsStarted, markAsComplete } from '$lib/server/api/communications/email/sends';
import { randomUUID } from 'crypto';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
import { read as readPerson } from '$lib/server/api/people/people';
import render from '$lib/server/utils/handlebars/render';

import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';
import { mainEmailOptions } from '$lib/server/utils/email/context/main.js';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendEmailToListSchema, body);

		const send = await markAsStarted({
			instanceId: event.locals.instance.id,
			sendId: parsed.send_id,
			messageId: parsed.message_id,
			t: event.locals.t
		});

		const message = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: parsed.message_id
		});

		if (!send.list_id) {
			log.debug({ send, parsed, body }, 'No list_id found in send');
			throw new BelcodaError(
				400,
				'WORKER:/utils/email/send_to_list:01',
				m.teary_dizzy_earthworm_urge()
			);
		}

		if (send.message_id !== message.id) {
			log.debug({ send, message }, 'Message ID does not match');
			throw new BelcodaError(
				400,
				'WORKER:/utils/email/send_to_list:02',
				m.teary_dizzy_earthworm_urge()
			);
		}
		const ids = await getAllPersonIds({
			instanceId: event.locals.instance.id,
			listId: send.list_id
		});

		//main loop to queue sending emails to the list
		for (let index = 0; index < ids.length; index++) {
			const id = ids[index];
			const uuid = randomUUID();
			const person = await readPerson({
				instance_id: event.locals.instance.id,
				person_id: id
			});

			const templateContext = {
				person: person,
				instance: event.locals.instance
			};

			const renderedHtml = await render({
				context: templateContext,
				template: message.html,
				instanceId: event.locals.instance.id,
				t: event.locals.t
			});

			const context = mainEmailOptions({
				instance: event.locals.instance,
				body: renderedHtml,
				previewText: message.preview_text,
				subject: message.subject,
				language: person.preferred_language ?? event.locals.instance.language
			});

			const sendToQueue: EmailTemplateMessage = {
				person_id: person.id,
				send_id: send.id,
				template: message.template_name,
				context: context,
				from: message.from,
				reply_to: message.reply_to,
				send_details: {
					type: 'send_to_list'
				}
			};

			await event.locals.queue(
				'utils/email/send_email/template',
				event.locals.instance.id,
				sendToQueue,
				event.locals.admin.id
			);
		}

		await markAsComplete({
			instanceId: event.locals.instance.id,
			sendId: parsed.send_id,
			messageId: parsed.message_id,
			t: event.locals.t
		});

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/utils/email/send_to_list:01', m.teary_dizzy_earthworm_urge(), err);
	}
}
