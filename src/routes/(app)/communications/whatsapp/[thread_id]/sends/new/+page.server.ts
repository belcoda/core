import { valibot, superValidate, loadError, formAction, redirect } from '$lib/server';
import { read } from '$lib/schema/communications/whatsapp/threads';
import { create } from '$lib/schema/communications/whatsapp/sends';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(valibot(create));

	const threadResult = await event.fetch(
		`/api/v1/communications/whatsapp/threads/${event.params.thread_id}`
	);
	if (!threadResult.ok) return loadError(threadResult);
	const threadBody = await threadResult.json();
	const threadParsed = parse(read, threadBody);
	return {
		thread: threadParsed,
		form: form,
		pageTitle: [{ key: 'THREADNAME', title: threadParsed.name }]
	};
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			event,
			inputSchema: create,
			method: 'POST',
			url: `/api/v1/communications/whatsapp/threads/${event.params.thread_id}/sends`
		});
		if (output.error) return output.output;
		return redirect(event, {
			location: `/communications/whatsapp/${event.params.thread_id}/sends`,
			message: m.weak_minor_cowfish_dine()
		});
	}
};
