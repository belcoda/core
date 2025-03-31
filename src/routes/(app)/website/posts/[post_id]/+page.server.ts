import {
	superValidate,
	message,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { update, read } from '$lib/schema/website/content';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(
		`/api/v1/website/content_types/${event.locals.instance.settings.website.posts_content_type_id}/content/${event.params.post_id}`
	);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, post: parsed, pageTitle: [{ key: 'POSTTITLE', title: parsed.name }] };
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
		log.debug(form.data);
		const response = await event.fetch(
			`/api/v1/website/content_types/${event.locals.instance.settings.website.posts_content_type_id}/content/${event.params.post_id}`,
			{
				method: 'PUT',
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
			location: `/website/posts`,
			message: m.white_acidic_koala_pop()
		});
	}
};
