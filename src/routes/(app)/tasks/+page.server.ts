import { loadError, formAction, redirect, filter, superValidate, valibot } from '$lib/server';
import * as schema from '$lib/schema/core/tasks';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const result = await event.fetch(filter('/api/v1/tasks', event.url));
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(schema.list, body);
	const form = await superValidate(valibot(schema.create));
	return { tasks: parsed, form };
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			event,
			inputSchema: schema.create,
			url: '/api/v1/tasks',
			method: 'POST'
		});
		if (output.error) return output.output;
		console.log(output.output);
		return redirect(event, { location: '/tasks', message: m.flat_sleek_millipede_agree() });
	}
};
