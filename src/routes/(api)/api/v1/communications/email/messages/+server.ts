import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as api from '$lib/server/api/communications/email/messages';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const read = await api.list({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			url: event.url
		});
		return json(read);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/messages:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const created = await api.create({
			instanceId: event.locals.instance.id,
			body,
			queue: event.locals.queue
		});
		return json(created);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/messages:POST01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
