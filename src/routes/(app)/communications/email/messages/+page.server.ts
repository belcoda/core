import { filter, loadError } from '$lib/server';
import { list } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
//load messages
export async function load(event) {
	const result = await event.fetch(filter(`/api/v1/communications/email/messages`, event.url));
	if (!result.ok) return loadError(result);
	const body = await result.json();
	//parse the response
	const parsed = parse(list, body);
	//return the parsed messages
	return { messages: parsed };
}
