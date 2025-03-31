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
import * as m from '$lib/paraglide/messages';
import { create, read } from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const form = await superValidate(
		{ ...event.locals.instance.settings.events.default_event_info_settings },
		valibot(create),
		{ errors: false } //does not set errors on form load (tainted/dirty fields with errors will still display, though)
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
			return message(form, new BelcodaError(400, 'VALIDATION', m.spare_mushy_dachshund_quell()), {
				status: 400
			});
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
			message: m.flat_sleek_millipede_agree()
		});
	}
};
