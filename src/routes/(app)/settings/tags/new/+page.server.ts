import { superValidate, valibot, redirect, pino, formAction } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { create, read } from '$lib/schema/core/tags';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}

export const actions = {
	default: async function post(event) {
		const { error, output } = await formAction({
			event,
			inputSchema: create,
			url: '/api/v1/tags',
			method: 'POST'
		});
		if (error) return output;
		return redirect(event, {
			location: `/settings/tags`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
