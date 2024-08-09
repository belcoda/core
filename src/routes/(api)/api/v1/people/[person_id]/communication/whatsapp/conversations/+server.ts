import { error, json, pino } from '$lib/server';
import { getActiveForPerson, read } from '$lib/server/api/communications/whatsapp/conversations';

export async function GET(event) {
	try {
		const personId = Number(event.params.person_id);
		const conversations = await getActiveForPerson({
			instanceId: event.locals.instance.id,
			personId,
			t: event.locals.t
		});
		return json({ active: conversations });
	} catch (err) {
		return error(
			500,
			'/api/v1/people/[person_id]/communication/whatsapp/conversations:POST',
			event.locals.t.errors.http[500](),
			err
		);
	}
}