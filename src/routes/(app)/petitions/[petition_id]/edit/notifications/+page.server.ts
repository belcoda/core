import {
	superValidate,
	message,
	formAction,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { read, update } from '$lib/schema/petitions/petitions';
import { update as updateEmailMessage } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/petitions/${event.params.petition_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	const autoresponseEmail = await superValidate(
		parsed.autoresponse_email,
		valibot(updateEmailMessage),
		{
			id: 'autoresponse'
		}
	);

	return {
		form,
		petition: parsed,
		autoresponseEmail,
		pageTitle: [{ key: 'EVENTNAME', title: parsed.name }]
	};
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			event,
			url: `/api/v1/petitions/${event.params.petition_id}`,
			method: 'PUT',
			inputSchema: update
		});
		if (result.error) return result.output;
		const parsed = parse(read, result.output);

		return redirect(event, {
			location: `/petitions/${parsed.id}/edit`,
			message: event.locals.t.forms.actions.updated()
		});
	}
};
