import { superValidate, valibot, formAction, redirect, loadError } from '$lib/server';
import { update, read } from '$lib/schema/people/groups';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const response = await event.fetch(`/api/v1/people/groups/${event.params.group_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, pageTitle: [{ key: 'GROUPNAME', title: parsed.name }], group: parsed };
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			method: 'PUT',
			event,
			url: `/api/v1/people/groups/${event.params.group_id}`,
			inputSchema: update
		});
		if (output.error) return output.output;
		const parsed = parse(read, output.output);
		return redirect(event, {
			location: `/people/groups/${parsed.id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
