import {
	superValidate,
	message,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage
} from '$lib/server';

import { create, read } from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
const log = pino('(app)/events/new/+page.server.ts');
export async function load(event) {
	const form = await superValidate(
		{ ...event.locals.instance.settings.events.default_event_info_settings },
		valibot(create)
	);
	return { form };
}

export const actions = {
	default: async function post(event) {
		const form = await superValidate<Infer<typeof create>, BelcodaError>(
			event.request,
			valibot(create)
		);
		if (!form.valid) {
			return message(
				form,
				new BelcodaError(400, 'VALIDATION', event.locals.t.errors.validation()),
				{ status: 400 }
			);
		}
		log.debug(form.data);
		const response = await event.fetch(`/api/v1/events`, {
			method: 'POST',
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
			message: event.locals.t.forms.actions.created()
		});
	}
};
