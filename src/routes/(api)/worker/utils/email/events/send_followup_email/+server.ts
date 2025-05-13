import { json, error, pino } from '$lib/server';
import { triggerEventMessage, type SendEventEmailMessage } from '$lib/schema/utils/email';
import { read as readPerson } from '$lib/server/api/people/people';
import { read as readEvent } from '$lib/server/api/events/events';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
import { type EmailTemplateMessage } from '$lib/schema/communications/email/messages';

import { queue as queueInteraction } from '$lib/server/api/people/interactions';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';
import { mainEmailOptions } from '$lib/server/utils/email/context/main.js';
import render from '$lib/server/utils/handlebars/render';
import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerEventMessage, body);
		const eventResponse = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: parsed.event_id
		});

		if (eventResponse.send_followup_email === false || !eventResponse.followup_email) {
			return json({ success: true, message: 'No followup email required' });
		}

		const person = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id
		});

		//now create the email body as though it was a regular send-to-list email (which it kinda is)
		const templateContext = {
			person: person,
			instance: event.locals.instance,
			event: eventResponse //this one gets passed to the template because it could be useful for event related customization
		};

		const renderedHtml = await render({
			context: templateContext,
			template: eventResponse.followup_email.html,
			instanceId: event.locals.instance.id,
			t: event.locals.t
		});

		const context = mainEmailOptions({
			instance: event.locals.instance,
			body: renderedHtml,
			previewText: eventResponse.followup_email.preview_text,
			subject: eventResponse.followup_email.subject,
			language: person.preferred_language ?? event.locals.instance.language
		});

		const messageResponse = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: eventResponse.followup_email.id
		});

		const sendToQueue: EmailTemplateMessage = {
			person_id: person.id,
			template: eventResponse.followup_email.template_name,
			context: context,
			from: eventResponse.followup_email.from,
			reply_to: eventResponse.followup_email.reply_to,
			send_details: {
				type: 'event_follow_up',
				event_id: eventResponse.id,
				message_id: messageResponse.id
			}
		};
		await event.locals.queue(
			'utils/email/send_email/template',
			event.locals.instance.id,
			sendToQueue,
			event.locals.admin.id
		);
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: person.id,
			adminId: event.locals.admin.id,
			details: {
				type: 'received_event_followup_email',
				event_id: eventResponse.id,
				event_name: eventResponse.name,
				message_id: messageResponse.id
			},
			queue: event.locals.queue
		});
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/events/send_followup_email:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}
