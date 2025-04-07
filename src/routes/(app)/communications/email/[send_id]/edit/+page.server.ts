import { formAction, valibot, superValidate, redirect, loadError } from '$lib/server';
import { update, read } from '$lib/schema/communications/email/sends';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const result = await event.fetch(`/api/v1/communications/email/sends/${event.params.send_id}`);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'PUT',
			url: `/api/v1/communications/email/sends/${event.params.send_id}`,
			event,
			inputSchema: update
		});
		if (result.error) {
			return result.output;
		}
		return redirect(event, {
			location: `/communications/email/${event.params.send_id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
