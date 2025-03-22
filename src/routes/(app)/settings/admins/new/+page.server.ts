import { superValidate, message, valibot, redirect, type Infer, BelcodaError } from '$lib/server';

import { create, read } from '$lib/schema/core/admin';

export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}
import * as m from '$lib/paraglide/messages';
export const actions = {
	default: async function post(event) {
		const form = await superValidate<Infer<typeof create>, BelcodaError>(
			event.request,
			valibot(create)
		);
		if (!form.valid) {
			return message(form, new BelcodaError(400, 'VALIDATION', m.spare_mushy_dachshund_quell()), {
				status: 400
			});
		}
		const content = await event
			.fetch(`/api/v1/admins`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			})
			.then((res) => res.json());
		return redirect(event, {
			location: `/settings/admins`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
