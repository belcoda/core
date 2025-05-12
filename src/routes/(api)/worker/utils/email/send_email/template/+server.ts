import { json, BelcodaError, pino } from '$lib/server';

import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

import { read } from '$lib/server/api/people/people';
import { create as createSentEmail } from '$lib/server/api/communications/email/sent_emails';

import sendEmailTemplate from '$lib/server/utils/email/send_template_email_postmark';
import { read as readEmailFrom } from '$lib/server/api/communications/email/from_signatures';
import { parse } from '$lib/schema/valibot';
import {
	type EmailTemplateName,
	emailTemplateMessage
} from '$lib/schema/communications/email/messages';
import { type Create as CreateSentEmail } from '$lib/schema/communications/email/sent_emails';
import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';

const TRANSACTIONAL_TEMPLATES: EmailTemplateName[] = [
	'transactional',
	'event-reminder-registration'
];

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(emailTemplateMessage, body);

		//make sure we only send to people who are subscribed and contactable
		const person = await read({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id
		});
		if (!person.email || !person.email.email)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_template_email:01',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} has no email address`
			);
		if (!person.email?.subscribed)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_template_email:02',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is not subscribed`
			);
		if (!person.email?.contactable)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_template_email:03',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is not contactable by email`
			);
		if (person.do_not_contact)
			throw new BelcodaError(
				404,
				'WORKER:/utils/email/send_template_email:04',
				m.teary_dizzy_earthworm_urge(),
				`Person with unique ID ${person.unique_id} is on the Do Not Contact list`
			);

		const stream = TRANSACTIONAL_TEMPLATES.includes(parsed.template) ? 'outbound' : 'broadcast'; //we need to use the bulk stream for non-transactional emails

		//TODO: Make sure parsed.from_signature_id is actually on the incoming email objects
		const fromSignature = await readEmailFrom({
			instanceId: event.locals.instance.id,
			fromSignatureId:
				parsed.from_signature_id ??
				event.locals.instance.settings.communications.email.default_from_signature_id ??
				0 //this is an ID which will not work, so it will always fail and return the error case
		})
			.then((result) => {
				return `${result.name} <${result.email}>`;
			})
			.catch((err) => {
				return `${event.locals.instance.name} <${event.locals.instance.slug}@${PUBLIC_ROOT_DOMAIN}>`;
			});

		const sent = await sendEmailTemplate({
			to: person.email.email,
			from: fromSignature,
			template: parsed.template,
			context: parsed.context,
			stream: stream
		});

		log.info(sent, 'Postmark template email sent successfully');

		const sentEmail: CreateSentEmail = {
			person_id: person.id,
			send_id: parsed.send_id ?? null,
			details: parsed.send_details
		};

		const sentEmailResponse = await createSentEmail({
			instanceId: event.locals.instance.id,
			body: sentEmail,
			t: event.locals.t
		});
		log.debug(sentEmailResponse, 'Created sent email record in the database');
	} catch (err) {
		log.error(err, 'Error sending email');
	} finally {
		//because we don't want to retry sending the email if it was already sent
		//we always return success, even if there was an error
		return json({ success: true });
	}
}
