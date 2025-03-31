import {
	loadError,
	valibot,
	superValidate,
	returnMessage,
	message,
	redirect,
	BelcodaError,
	type Infer
} from '$lib/server';
import { update, read } from '$lib/schema/communications/email/templates';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const response = await event.fetch(
		`/api/v1/communications/email/templates/${event.params.template_id}`
	);
	if (!response.ok) {
		return loadError(response);
	}
	const template = await response.json();
	const parsed = v.parse(read, template);
	const form = await superValidate(parsed, valibot(update));
	return { template: parsed, form };
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
		const response = await event.fetch(
			`/api/v1/communications/email/templates/${event.params.template_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			}
		);
		if (!response.ok) return returnMessage(response, form);
		return redirect(event, {
			location: `/settings/communications/email/templates`,
			message: m.white_acidic_koala_pop()
		});
	}
};
