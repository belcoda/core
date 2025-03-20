import { formAction, valibot, superValidate, redirect, loadError } from '$lib/server';
import { update, readListWithPeople, read } from '$lib/schema/people/lists';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const result = await event.fetch(`/api/v1/people/lists/${event.params.list_id}`);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(readListWithPeople, body);
	//const parseBase = parse(base, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, pageTitle: [{ key: 'LISTNAME', title: parsed.name }] };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'PUT',
			url: `/api/v1/people/lists/${event.params.list_id}`,
			event,
			inputSchema: update
		});
		if (result.error) {
			return result.output;
		}
		const parsed = parse(read, result.output);
		return redirect(event, {
			location: `/people/lists/${parsed.id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
