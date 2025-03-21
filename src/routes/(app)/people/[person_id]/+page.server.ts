import { loadError, filter } from '$lib/server';
import { read } from '$lib/schema/people/people';
import { list as listInteractions } from '$lib/schema/people/interactions';
import { parse } from '$lib/schema/valibot';
import { formattedPhoneNumber } from '$lib/schema/people/channels/channels';

export async function load(event) {
	const result = await event.fetch(
		`/api/v1/people/${event.params.person_id}?display=communications`
	);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(read, body);
	const nationalFormatPhoneNumber = parsed.phone_number?.phone_number
		? parse(formattedPhoneNumber, parsed.phone_number)
		: null;

	const interactionsUrl = new URL(
		`/api/v1/people/${event.params.person_id}/interactions`,
		event.url
	);
	const page = event.url.searchParams.get('page');
	if (page) {
		interactionsUrl.searchParams.set('page', page);
	}
	interactionsUrl.searchParams.set('display', 'activity');

	const interactions = await event.fetch(filter(interactionsUrl.toString(), event.url));
	if (!result.ok) loadError(interactions);
	const interactionsBody = await interactions.json();
	const parsedInteractions = parse(listInteractions, interactionsBody);

	const personRecord = {
		...parsed,
		phone_number: nationalFormatPhoneNumber
	};
	return {
		person: personRecord,
		interactions: parsedInteractions,
		pageTitle: [{ key: 'PERSONNAME', title: parsed.full_name }]
	};
}

export const actions = {
	delete: async ({ params, fetch }) => {
		const response = await fetch(`/api/v1/people/${params.person_id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			return loadError(response);
		}

		return { success: true };
	}
};
