import { json, error, pino } from '$lib/server';
import {
	sendEmailMessage,
	triggerPetitionMessage,
	type SendEmailMessage
} from '$lib/schema/utils/email';
import renderEmail from '$lib/server/utils/handlebars/render_email';
import { read as readPetition } from '$lib/server/api/petitions/petitions';
import { read as readPerson } from '$lib/server/api/people/people';
import { read as readTemplate } from '$lib/server/api/communications/email/templates';
import { read as readMessage } from '$lib/server/api/communications/email/messages';
const log = pino(import.meta.url);
import { randomUUID } from 'crypto';
import { id, parse } from '$lib/schema/valibot';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerPetitionMessage, body);

		const petition = await readPetition({
			instanceId: event.locals.instance.id,
			petitionId: parsed.petition_id,
			t: event.locals.t
		});

		if (petition.send_autoresponse_email === false) {
			return json({ success: true, outcome: 'No autoresponse email required' });
		}

		const message = await readMessage({
			instanceId: event.locals.instance.id,
			messageId: petition.autoresponse_email.id,
			t: event.locals.t
		});

		const template = await readTemplate({
			instanceId: event.locals.instance.id,
			templateId: message.template_id,
			t: event.locals.t
		});

		const person = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			t: event.locals.t
		});

		const sentEmailId = randomUUID();

		// handlebars the templates...

		const renderedHtml = await renderEmail({
			emailUnsubscribeToken: sentEmailId,
			messageTemplate: message.html,
			templateTemplate: template.html,
			instanceId: event.locals.instance.id,
			context: { petition, person, instance: event.locals.instance },
			t: event.locals.t
		});
		const renderedText = message.use_html_for_plaintext
			? renderedHtml
			: await renderEmail({
					emailUnsubscribeToken: sentEmailId,
					messageTemplate: message.text,
					templateTemplate: template.text,
					instanceId: event.locals.instance.id,
					context: { petition, person, instance: event.locals.instance },
					t: event.locals.t
				});
		const sendToQueue: SendEmailMessage = {
			person_id: person.id,
			email: { ...message, html: renderedHtml, text: renderedText },
			sent_email_id: sentEmailId,
			email_message_id: message.id
		};
		const parsedSendToQueue = parse(sendEmailMessage, sendToQueue);
		await event.locals.queue(
			'utils/email/send_email',
			event.locals.instance.id,
			parsedSendToQueue,
			event.locals.admin.id
		);

		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: person.id,
			adminId: event.locals.admin.id,
			details: {
				type: 'received_petition_autoresponse_email',
				petition_id: petition.id,
				petition_name: petition.name,
				message_id: message.id
			},
			queue: event.locals.queue
		});

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/send_petition_autoresponse:01',
			event.locals.t.errors.generic(),
			err
		);
	}
}
