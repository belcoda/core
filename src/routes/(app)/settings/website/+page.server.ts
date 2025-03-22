import { valibot, superValidate, formAction, redirect } from '$lib/server';
import { update, read } from '$lib/schema/core/instance';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(event.locals.instance, valibot(update));
	return { form };
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			event,
			url: '/api/v1/settings/organization',
			method: 'PUT',
			inputSchema: update
		});
		if (output.error) return output.output;
		const parsed = parse(read, output.output);
		event.locals.instance = parsed;
		return redirect(event, {
			message: m.careful_smug_monkey_bask()
		});
	}
};
