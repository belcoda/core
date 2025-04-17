import { json } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { addPersonToListQueued } from '$lib/schema/people/lists';
import { addPersonToList } from '$lib/server/api/people/lists';
export async function POST(event) {
	const body = await event.request.json();
	const parsed = parse(addPersonToListQueued, body);
	await addPersonToList({
		instanceId: event.locals.instance.id,
		listId: parsed.list_id,
		personId: parsed.person_id
	});
	return json({ success: true });
}
