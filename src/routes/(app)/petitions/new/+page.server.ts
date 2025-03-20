import {
	superValidate,
	message,
	valibot,
	redirect,
	formAction,
	type Infer,
	pino,
	BelcodaError,
	returnMessage
} from '$lib/server';

import { create, read } from '$lib/schema/petitions/petitions';
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
		const output = await formAction({
			event,
			url: '/api/v1/petitions',
			inputSchema: create,
			method: 'POST'
		});
		if (output.error) return output.output;
		const parsed = parse(read, output.output);
		return redirect(event, {
			location: `/petitions/${parsed.id}`,
			message: event.locals.t.forms.actions.created()
		});
	}
};
