import { loadError, valibot, superValidate, formAction, redirect } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/website/uploads';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(valibot(schema.create));
	return { form };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'POST',
			url: '/api/v1/website/uploads',
			event,
			inputSchema: schema.create
		});
		if (result.error) return result.output;
		return redirect(event, {
			location: '/website/uploads',
			message: m.flat_sleek_millipede_agree()
		});
	}
};
