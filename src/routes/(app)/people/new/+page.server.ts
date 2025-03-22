import { formAction, valibot, superValidate, redirect } from '$lib/server';
import { create, read } from '$lib/schema/people/people';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'POST',
			url: '/api/v1/people',
			event,
			inputSchema: create
		});
		if (result.error) {
			return result.output;
		}

		const parsed = parse(read, result.output);
		return redirect(event, {
			location: `/people/${parsed.id}`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
