import {
	superValidate,
	message,
	valibot,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { redirect } from '@sveltejs/kit';
import { PUBLIC_HOST } from '$env/static/public';

import { update, read } from '$lib/schema/petitions/petitions';
import { list as listForEvent } from '$lib/schema/petitions/signatures';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/petitions/${event.params.petition_id}`);
	if (!response.ok) return loadError(response);
	const petitionBody = await response.json();
	const parsedPetition = parse(read, petitionBody);

	const url = new URL(PUBLIC_HOST);
	return redirect(
		301,
		`${url.protocol}//${event.locals.instance.slug}.${url.host}/petitions/${parsedPetition.slug}`
	);
}
