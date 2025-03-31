import { superValidate, valibot, pino, loadError } from '$lib/server';

import { update, read } from '$lib/schema/website/content';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(
		`/api/v1/website/content_types/${event.locals.instance.settings.website.pages_content_type_id}/content/${event.params.page_id}`
	);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, content: parsed, pageTitle: [{ key: 'PAGETITLE', title: parsed.name }] };
}
