import { loadError, filter, formAction, redirect, valibot, superValidate } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/core/tags';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const response = await event.fetch(filter(`/api/v1/tags/${event.params.tag_id}`, event.url));
	if (!response.ok) {
		return loadError(response);
	}
	const body = await response.json();
	const parsed = parse(schema.update, body);
	const form = await superValidate(parsed, valibot(schema.update));
	return { form };
}

export const actions = {
	default: async function post(event) {
		const { error, output } = await formAction({
			event,
			inputSchema: schema.update,
			url: `/api/v1/tags/${event.params.tag_id}`,
			method: 'PUT'
		});
		if (error) return output;
		return redirect(event, {
			location: `/settings/tags`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
