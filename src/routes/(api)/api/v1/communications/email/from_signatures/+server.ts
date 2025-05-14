import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as api from '$lib/server/api/communications/email/from_signatures';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const list = event.url.searchParams.get('list');
		if (list === 'verified') {
			const verified = await api.list({
				verifiedOnly: true,
				instanceId: event.locals.instance.id,
				url: event.url
			});
			return json(verified);
		} else {
			const read = await api.list({
				instanceId: event.locals.instance.id,
				url: event.url
			});
			return json(read);
		}
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/from_signatures:GET01',
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
			body
		});
		return json(created);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/from_signatures:POST01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
