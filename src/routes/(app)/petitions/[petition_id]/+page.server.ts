import { pino, loadError } from '$lib/server';

import { read } from '$lib/schema/petitions/petitions';
import { list as listForPetition } from '$lib/schema/petitions/signatures';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(`/api/v1/petitions/${event.params.petition_id}`);
	if (!response.ok) return loadError(response);
	const petitionBody = await response.json();
	const parsedPetition = parse(read, petitionBody);

	const signaturesResponse = await event.fetch(
		`/api/v1/petitions/${event.params.petition_id}/signatures`
	);
	if (!signaturesResponse.ok) return loadError(signaturesResponse);
	const signaturesBody = await signaturesResponse.json();
	const signatures = parse(listForPetition, signaturesBody);

	return {
		petition: parsedPetition,
		signatures: signatures,
		pageTitle: [{ key: 'PETITIONTITLE', title: parsedPetition.name }]
	};
}
