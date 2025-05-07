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
import * as m from '$lib/paraglide/messages';
import { read, update } from '$lib/schema/events/events';
import { update as updateEmailMessage } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);

	//the follow up message on the read schema is a message object, but we need to send the id of the message in the update schema
	const parsedEventForUpdating = {
		...parsed,
		followup_email: parsed.followup_email ? parsed.followup_email.id : null
	};
	const form = await superValidate(parsedEventForUpdating, valibot(update));

	return {
		form,
		event: parsed,
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
			return message(form, new BelcodaError(400, 'VALIDATION', m.spare_mushy_dachshund_quell()), {
				status: 400
			});
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
			message: m.white_acidic_koala_pop()
		});
	}
};
