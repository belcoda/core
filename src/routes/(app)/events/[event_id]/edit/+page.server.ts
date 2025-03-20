import {
	superValidate,
	message,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { update, read } from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, pageTitle: [{ key: 'EVENTNAME', title: parsed.name }] };
}

export const actions = {
	default: async function post(event) {
		const form = await superValidate<Infer<typeof update>, BelcodaError>(
			event.request,
			valibot(update)
		);
		if (!form.valid) {
			return message(
				form,
				new BelcodaError(400, 'VALIDATION', event.locals.t.errors.validation()),
				{ status: 400 }
			);
		}
		log.debug(form.data);
		const response = await event.fetch(`/api/v1/events/${event.params.event_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});
		log.debug(response.ok);
		if (!response.ok) return returnMessage(response, form);
		const body = await response.json();
		log.debug(body);
		const parsed = parse(read, body);
		return redirect(event, {
			location: `/events/${parsed.id}`,
			message: event.locals.t.forms.actions.updated()
		});
	}
};
