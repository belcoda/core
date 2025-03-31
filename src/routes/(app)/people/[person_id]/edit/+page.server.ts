import { formAction, valibot, superValidate, redirect, loadError } from '$lib/server';
import { update, read } from '$lib/schema/people/people';
import { parse } from '$lib/schema/valibot';
import { page } from '$app/stores';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const result = await event.fetch(`/api/v1/people/${event.params.person_id}`);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(read, body);
	//const parseBase = parse(base, body);
	const form = await superValidate(parsed, valibot(update));
	return { person: parsed, form, pageTitle: [{ key: 'PERSONNAME', title: parsed.full_name }] };
}

export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'PUT',
			url: `/api/v1/people/${event.params.person_id}`,
			event,
			inputSchema: update
		});
		if (result.error) {
			return result.output;
		}

		const parsed = parse(read, result.output);
		return redirect(event, {
			location: `/people/${parsed.id}`,
			message: m.white_acidic_koala_pop()
		});
	}
};
