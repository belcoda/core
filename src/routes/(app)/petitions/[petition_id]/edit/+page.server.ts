import { superValidate, valibot, formAction, redirect, pino, loadError } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { update, read } from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(`/api/v1/petitions/${event.params.petition_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, pageTitle: [{ key: 'PETITIONTITLE', title: parsed.name }] };
}

export const actions = {
	default: async function post(event) {
		const response = await formAction({
			event,
			url: `/api/v1/petitions/${event.params.petition_id}`,
			method: 'PUT',
			inputSchema: update
		});
		if (response.error) return response.output;
		const parsed = parse(read, response.output);
		return redirect(event, {
			location: `/petitions/${parsed.id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
