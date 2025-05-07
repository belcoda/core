import { json, pino } from '$lib/server';
import { sendTestEmail } from '$lib/schema/communications/email/messages';
import { _getPersonByEmail, list as listPeople } from '$lib/server/api/people/people';

import sendEmail from '$lib/server/utils/email/send_template_email_postmark';
import { _getPersonByWhatsappId } from '$lib/server/api/people/people';
import { parse } from '$lib/schema/valibot';
import { randomUUID } from 'crypto';
import { mainEmailOptions } from '$lib/server/utils/email/context/main.js';
import render from '$lib/server/utils/handlebars/render';

const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const newUUID = randomUUID();
		const parsed = parse(sendTestEmail, await event.request.json());
		//check if the person exists with the email address we're sending to. That will be most authentic.
		const person = await _getPersonByEmail({
			instanceId: event.locals.instance.id,
			email: parsed.email,
			t: event.locals.t
		}).catch(async () => {
			log.debug(`No person found with email ${parsed.email}`);
			//return a default person (ie: the first person in the list)
			const returnedList = await listPeople({
				instance_id: event.locals.instance.id,
				url: event.url
			});
			return returnedList.items[0];
		});

		const templateContext = { person, instance: event.locals.instance };

		const renderedHtml = await render({
			context: templateContext,
			template: parsed.message.html,
			instanceId: event.locals.instance.id,
			t: event.locals.t
		});

		const context = mainEmailOptions({
			instance: event.locals.instance,
			body: renderedHtml,
			previewText: parsed.message.preview_text,
			subject: parsed.message.subject,
			language: person.preferred_language ?? event.locals.instance.language
		});

		await sendEmail({
			from:
				parsed.message.from ||
				event.locals.instance.settings.communications.email.default_from_name,
			to: parsed.email,
			template: parsed.message.template_name,
			context: context,
			stream: 'broadcast'
		});
	} catch (err) {
		log.error(err, 'Error sending test email');
	} finally {
		return json({ success: true });
	}
}
