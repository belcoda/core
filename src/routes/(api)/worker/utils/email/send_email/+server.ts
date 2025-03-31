import { json, error, pino, BelcodaError } from '$lib/server';
import { sendEmailMessage as sendEmailSchema } from '$lib/schema/utils/email';
import sendEmail from '$lib/server/utils/email/send_email_postmark';
import { markAsComplete } from '$lib/server/api/communications/email/sends.js';
const log = pino(import.meta.url);
import { read } from '$lib/server/api/people/people';
import { create as createSentEmail } from '$lib/server/api/communications/email/sent_emails';
import * as m from '$lib/paraglide/messages';

import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendEmailSchema, body); //because we want to allow custom fields to be passed through to the function
		const person = await read({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			t: event.locals.t
		});
		if (!person.email || !person.email.email)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_email:01',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} has no email address`
			);
		if (!person.email?.subscribed)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_email:02',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is not subscribed`
			);
		if (!person.email?.contactable)
			return error(
				404,
				'WORKER:/utils/email/send_email:03',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is not contactable by email`
			);
		if (person.do_not_contact)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_email:04',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is on the Do Not Contact list`
			);
		await sendEmail({
			from: parsed.email.from,
			to: person.email.email,
			subject: parsed.email.subject,
			text: parsed.email.use_html_for_plaintext ? undefined : parsed.email.text,
			html: parsed.email.html,
			replyTo: parsed.email.reply_to || `${event.locals.instance.slug}@belcoda.com`,
			stream: 'broadcast'
		});

		log.debug('SENT EMAIL');
		//log.debug(emailReturn);

		const sentEmail = {
			person_id: person.id,
			id: parsed.sent_email_id,
			message_id: parsed.email_message_id,
			message: parsed.email
		};

		const sentEmailResponse = await createSentEmail({
			instanceId: event.locals.instance.id,
			body: sentEmail,
			t: event.locals.t
		});

		log.debug('SENT EMAIL RESPONSE');
		//log.debug(sentEmailResponse);

		if (parsed.finish_send_id) {
			await markAsComplete({
				instanceId: event.locals.instance.id,
				sendId: parsed.finish_send_id,
				t: event.locals.t
			});
		}

		return json(sentEmailResponse);
	} catch (err) {
		return error(500, 'WORKER:/utils/email/send_email:01', m.teary_dizzy_earthworm_urge(), err);
	}
}
