import { valibot, superValidate, formAction, redirect } from '$lib/server';
import { create, read } from '$lib/schema/people/imports';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			event,
			url: '/api/v1/people/imports',
			method: 'POST',
			inputSchema: create
		});
		if (output.error) return output.output;
		//const parsed = parse(read, output.output);
		return redirect(event, {
			location: '/settings/people/imports',
			message: m.east_happy_vole_value()
		});
	}
};
