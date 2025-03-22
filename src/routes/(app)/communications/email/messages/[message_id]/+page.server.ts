import {
	loadError,
	pino,
	type Infer,
	BelcodaError,
	returnMessage,
	redirect,
	message,
	superValidate,
	valibot
} from '$lib/server';
import { read, update } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const response = await event.fetch(
		`/api/v1/communications/email/messages/${event.params.message_id}`
	);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));

	return {
		message: parsed,
		form,
		pageTitle: [{ key: 'MESSAGEID', title: body.id }]
	};
}

export const actions = {
	default: async function (event) {
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
			`/api/v1/communications/email/messages/${event.params.message_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			}
		);

		if (!response.ok) return returnMessage(response, form);

		const body = await response.json();

		const parsed = parse(read, body);

		return redirect(event, {
			location: `/communications/email/messages/${parsed.id}`,
			message: m.lower_least_sawfish_favor()
		});
	}
};
