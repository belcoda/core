import { filter, loadError } from '$lib/server';
import { read } from '$lib/schema/communications/whatsapp/threads';
import { list } from '$lib/schema/communications/whatsapp/sends';
import { parse } from '$lib/schema/valibot';
export async function load(event) {
	const result = await event.fetch(
		filter(`/api/v1/communications/whatsapp/threads/${event.params.thread_id}/sends`, event.url)
	);
	if (!result.ok) return loadError(result);
	const body = await result.json();
	const parsed = parse(list, body);

	const threadResult = await event.fetch(
		`/api/v1/communications/whatsapp/threads/${event.params.thread_id}`
	);
	if (!threadResult.ok) return loadError(threadResult);
	const threadBody = await threadResult.json();
	const threadParsed = parse(read, threadBody);
	return {
		thread: threadParsed,
		sends: parsed,
		pageTitle: [{ key: 'THREADNAME', title: threadParsed.name }]
	};
}
