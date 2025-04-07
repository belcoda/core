import { error, json } from '$lib/server';
import * as api from '$lib/server/api/communications/whatsapp/messages';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const itemId = Number(event.params.thread_id);
		const result = await api.list({
			instanceId: event.locals.instance.id,
			threadId: itemId,
			url: event.url
		});
		return json(result);
	} catch (err) {
		return error(
			500,
			'API:/communications/whatsapp/threads/[thread_id]/messages:GET',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
