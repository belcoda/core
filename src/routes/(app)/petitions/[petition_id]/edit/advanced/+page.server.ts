import { superValidate, valibot, pino, loadError } from '$lib/server';

import { update, read } from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/petitions/${event.params.petition_id}`);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form, petition: parsed, pageTitle: [{ key: 'PETITIONTITLE', title: parsed.name }] };
}
