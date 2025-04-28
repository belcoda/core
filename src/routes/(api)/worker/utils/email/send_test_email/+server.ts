import { sendTestEmail } from '$lib/schema/communications/email/messages';
import { read } from '$lib/server/api/communications/email/templates';
import { list as listPeople, read as readPerson } from '$lib/server/api/people/people';
import { read as readEvent } from '$lib/server/api/events/events';
import renderEmail from '$lib/server/utils/handlebars/render_email';
import sendEmail from '$lib/server/utils/email/send_email_postmark';
import { parse } from '$lib/schema/valibot';
import { randomUUID } from 'crypto';
import { json } from '@sveltejs/kit';
export async function POST(event) {
	const newUUID = randomUUID();
	const parsed = parse(sendTestEmail, await event.request.json());
	const template = await read({
		instanceId: event.locals.instance.id,
		templateId: parsed.message.template_id,
		t: event.locals.t
	});

	let person;
	if (parsed.context.person_id) {
		const selected = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.context.person_id
		});
		person = selected;
	} else {
		const { items } = await listPeople({
			instance_id: event.locals.instance.id,
			url: event.url
		});
		person = items[0];
	}

	let eventObject;
	if (parsed.context.event_id) {
		const selected = await readEvent({
			instanceId: event.locals.instance.id,
			eventId: parsed.context.event_id
		});
		eventObject = selected;
	}

	const context = { event: eventObject, person, instance: event.locals.instance };

	const renderedHtml = await renderEmail({
		emailUnsubscribeToken: newUUID,
		messageTemplate: parsed.message.html,
		templateTemplate: template.html,
		instanceId: event.locals.instance.id,
		context,
		t: event.locals.t
	});
	const renderedText = parsed.message.use_html_for_plaintext
		? renderedHtml
		: await renderEmail({
				emailUnsubscribeToken: newUUID,
				messageTemplate: parsed.message.text,
				templateTemplate: template.text,
				instanceId: event.locals.instance.id,
				context,
				t: event.locals.t
			});

	await sendEmail({
		from: parsed.message.from,
		to: parsed.email,
		subject: parsed.message.subject,
		text: parsed.message.use_html_for_plaintext ? undefined : renderedText,
		html: renderedHtml,
		replyTo: parsed.message.reply_to || `${event.locals.instance.slug}@belcoda.org`,
		stream: 'outbound'
	});

	return json({ success: true });
}
