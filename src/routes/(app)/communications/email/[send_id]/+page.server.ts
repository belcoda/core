import { loadError, superValidate, valibot, formAction, redirect } from '$lib/server';
import { read as readSend } from '$lib/schema/communications/email/sends';
import { update, read as readMessage } from '$lib/schema/communications/email/messages';
import { list as listTemplates } from '$lib/schema/communications/email/templates';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const result = await event.fetch(`/api/v1/communications/email/sends/${event.params.send_id}`);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(readSend, body);

	const templateResult = await event.fetch('/api/v1/communications/email/templates');
	if (!templateResult.ok) return loadError(templateResult);
	const templateBody = await templateResult.json();
	const templates = parse(listTemplates, templateBody);

	const messageResult = await event.fetch(
		`/api/v1/communications/email/messages/${parsed.message_id}`
	);
	if (!messageResult.ok) return loadError(messageResult);
	const messageBody = await messageResult.json();
	const message = parse(readMessage, messageBody);

	const form = await superValidate(message, valibot(update));

	return { send: parsed, message, form, templates };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'PUT',
			url: `/api/v1/communications/email/messages/${event.url.searchParams.get('message_id')}`,
			event,
			inputSchema: update
		});
		if (result.error) {
			return result.output;
		}
		return redirect(event, {
			location: `/communications/email/${event.params.send_id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
