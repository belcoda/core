import { superValidate, valibot, formAction, redirect, pino, loadError } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { create, read } from '$lib/schema/communications/email/from_signatures';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}

export const actions = {
	default: async function post(event) {
		const response = await formAction({
			event,
			url: `/api/v1/communications/email/from_signatures`,
			method: 'POST',
			inputSchema: create
		});
		if (response.error) return response.output;
		const parsed = parse(read, response.output);
		return redirect(event, {
			location: `/settings/email/from_signatures`,
			message: m.white_acidic_koala_pop()
		});
	}
};
