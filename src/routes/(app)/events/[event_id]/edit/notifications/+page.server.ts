import {
	superValidate,
	message,
	error,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { read, update } from '$lib/schema/events/events';
import { update as updateEmailMessage } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	const messageForms = {
		reminder: await superValidate(parsed.reminder_email, valibot(updateEmailMessage), {
			id: 'reminder'
		}),
		registration: await superValidate(parsed.registration_email, valibot(updateEmailMessage), {
			id: 'registration'
		}),
		cancellation: await superValidate(parsed.cancellation_email, valibot(updateEmailMessage), {
			id: 'cancellation'
		}),
		followup: await superValidate(parsed.followup_email, valibot(updateEmailMessage), {
			id: 'followup'
		})
	};

	return {
		form,
		event: parsed,
		messageForms,
		pageTitle: [{ key: 'EVENTNAME', title: parsed.name }]
	};
}

export const actions = {
	default: async function (event) {
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
		const response = await event.fetch(`/api/v1/events/${event.params.event_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});

		if (!response.ok) return returnMessage(response, form);

		const body = await response.json();

		const parsed = parse(read, body);

		return redirect(event, {
			location: `/events/${parsed.id}/edit`,
			message: event.locals.t.forms.actions.updated()
		});
	}
};
