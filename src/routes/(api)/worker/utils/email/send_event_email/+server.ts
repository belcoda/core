import { json, error, pino } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { sendEventEmailMessage } from '$lib/schema/utils/email';
import { type EmailTemplateMessage } from '$lib/schema/communications/email/messages';

const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

import { eventReminderOptions } from '$lib/server/utils/email/context/eventReminder';
import { eventRegistrationOptions } from '$lib/server/utils/email/context/eventRegistration';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(sendEventEmailMessage, body);

		const contextOptions = {
			instance: event.locals.instance,
			event: parsed.event,
			language: parsed.person.preferred_language || event.locals.instance.language
		};

		// the only two types of event_email are reminder and registration
		const context =
			parsed.details.type === 'event_reminder'
				? eventReminderOptions(contextOptions)
				: eventRegistrationOptions(contextOptions);

		const output: EmailTemplateMessage = {
			context,
			send_details: parsed.details,
			template: parsed.template,
			person_id: parsed.person.id,
			reply_to: null
		};

		await event.locals.queue(
			'utils/email/send_email/template',
			event.locals.instance.id,
			output,
			event.locals.admin.id
		);
		log.debug(output, 'Sent event email to queue with these details');
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
