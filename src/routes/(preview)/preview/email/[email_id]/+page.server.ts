import { loadError, pino } from '$lib/server';
import renderHandlebarsTemplate from '$lib/server/utils/handlebars/render';
import { read as readMessage } from '$lib/schema/communications/email/messages';
import { read as readTemplate } from '$lib/schema/communications/email/templates';
import { read as readEvent } from '$lib/schema/events/events';
import { randomUUID } from 'crypto';
import { parse } from '$lib/schema/valibot';

const log = pino(import.meta.url);
export const load = async (event) => {
	const messageResponse = await event.fetch(
		`/api/v1/communications/email/messages/${event.params.email_id}`
	);
	if (!messageResponse.ok) return loadError(messageResponse);
	const messageBody = await messageResponse.json();
	const parsedMessage = parse(readMessage, messageBody);

	const templateResponse = await event.fetch(
		`/api/v1/communications/email/templates/${parsedMessage.template_id}`
	);
	if (!templateResponse.ok) return loadError(templateResponse);
	const templateBody = await templateResponse.json();
	const parsedTemplate = parse(readTemplate, templateBody);

	const htmlMerged = parsedTemplate.html.replace('{{{body}}}', parsedMessage.html);
	const textMerged = parsedTemplate.text.replace('{{{body}}}', parsedMessage.text);

	if (event.url.searchParams.get('event_id')) {
		//it's an event preview email
		const eventResponse = await event.fetch(
			`/api/v1/events/${event.url.searchParams.get('event_id')}`
		);
		if (!eventResponse.ok) return loadError(eventResponse);
		const eventBody = await eventResponse.json();
		const parsedEvent = parse(readEvent, eventBody);

		const person = { full_name: 'Example User', email: { email: 'example@example.com' } };

		const context = { event: parsedEvent, person, instance: event.locals.instance };
		log.debug(context);
		log.debug(textMerged);
		const html = await renderHandlebarsTemplate({
			template: htmlMerged,
			emailUnsubscribeToken: randomUUID(),
			context,
			instanceId: event.locals.instance.id
		});

		const text = await renderHandlebarsTemplate({
			template: textMerged,
			emailUnsubscribeToken: randomUUID(),
			context,
			instanceId: event.locals.instance.id
		});

		return { html, text, message: parsedMessage };
	}
};
