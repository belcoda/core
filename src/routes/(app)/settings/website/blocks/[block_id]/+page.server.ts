import {
	loadError,
	valibot,
	superValidate,
	returnMessage,
	message,
	redirect,
	BelcodaError,
	pino,
	type Infer
} from '$lib/server';
import { update, read } from '$lib/schema/website/blocks';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/website/blocks/${event.params.block_id}`);
	if (!response.ok) {
		return loadError(response);
	}
	const block = await response.json();
	const parsed = v.parse(read, block);
	const form = await superValidate(parsed, valibot(update));
	return { block: parsed, form };
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
		const response = await event.fetch(`/api/v1/website/blocks/${event.params.block_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});
		if (!response.ok) {
			return returnMessage(response, form);
		}
		return redirect(event, {
			location: `/settings/website/blocks`,
			message: m.white_acidic_koala_pop()
		});
	}
};
