import { redirect, formAction, superValidate, valibot } from '$lib/server';
import { create, read } from '$lib/schema/people/groups';
import { parse } from '$lib/schema/valibot';
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}
import * as m from '$lib/paraglide/messages';
export const actions = {
	default: async function (event) {
		const output = await formAction({
			method: 'POST',
			event,
			url: `/api/v1/people/groups`,
			inputSchema: create
		});
		if (output.error) return output.output;
		const parsed = parse(read, output.output);
		return redirect(event, {
			location: `/people/groups/${parsed.id}`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
