import { formAction, valibot, superValidate, redirect, loadError } from '$lib/server';
import { update, read, sendToList } from '$lib/schema/communications/email/sends';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
export async function load(event) {
	const result = await event.fetch(`/api/v1/communications/email/sends/${event.params.send_id}`);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(read, body);
	const form = await superValidate(valibot(sendToList));
	return { form, send: parsed };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'PUT',
			url: `/api/v1/communications/email/sends/${event.params.send_id}/send`,
			event,
			inputSchema: sendToList
		});
		if (result.error) {
			return result.output;
		}
		return redirect(event, {
			location: `/communications/email/${event.params.send_id}`,
			message: m.muddy_ornate_lionfish_gaze()
		});
	}
};
