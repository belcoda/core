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
