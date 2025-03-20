import {
	superValidate,
	message,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage
} from '$lib/server';

import { create, read } from '$lib/schema/website/content';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const form = await superValidate(valibot(create));
	return { form };
}

export const actions = {
	default: async function post(event) {
		const form = await superValidate<Infer<typeof create>, BelcodaError>(
			event.request,
			valibot(create)
		);
		if (!form.valid) {
			return message(
				form,
				new BelcodaError(400, 'VALIDATION', event.locals.t.errors.validation()),
				{ status: 400 }
			);
		}
		log.debug(form.data);
		const response = await event.fetch(
			`/api/v1/website/content_types/${event.locals.instance.settings.website.pages_content_type_id}/content`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			}
		);
		log.debug(response.ok);
		if (!response.ok) return returnMessage(response, form);
		const body = await response.json();
		log.debug(body);
		const parsed = parse(read, body);
		return redirect(event, {
			location: `/website/pages/${parsed.id}`,
			message: event.locals.t.forms.actions.created()
		});
	}
};
