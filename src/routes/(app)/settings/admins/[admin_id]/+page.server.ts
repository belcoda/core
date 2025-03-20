import {
	superValidate,
	message,
	valibot,
	redirect,
	loadError,
	BelcodaError,
	type Infer
} from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { update, read } from '$lib/schema/core/admin';
import { parse } from '$lib/schema/valibot';

export async function load(event) {
	const response = await event.fetch(`/api/v1/admins/${event.params.admin_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form };
}

export const actions = {
	default: async function post(event) {
		const form = await superValidate<Infer<typeof update>, BelcodaError>(
			event.request,
			valibot(update)
		);
		if (!form.valid) {
			return message(form, new BelcodaError(400, 'VALIDATION', m.spare_mushy_dachshund_quell()), {
				status: 400
			});
		}
		const content = await event
			.fetch(`/api/v1/admins/${event.params.admin_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			})
			.then((res) => res.json());
		return redirect(event, {
			location: `/settings/admins`,
			message: m.white_acidic_koala_pop()
		});
	}
};
