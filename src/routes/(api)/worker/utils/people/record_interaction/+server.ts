import { json, pino, error } from '$lib/server';
import { create as createInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);
export async function POST(event) {
	try {
		const body = await event.request.json();
		log.debug('recording interaction');
		await createInteraction({
			instanceId: event.locals.instance.id,
			body,
			t: event.locals.t
		});
		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/utils/people/record_interaction:01', m.spry_ago_baboon_cure(), err);
	}
}
