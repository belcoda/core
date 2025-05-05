import { json, error, pino } from '$lib/server/';
import * as api from '$lib/server/api/communications/email/sends';
import * as m from '$lib/paraglide/messages';

const log = pino(import.meta.url);

export async function GET(event) {
	try {
		const sends = await api.list({
			instanceId: event.locals.instance.id,
			messageId: Number(event.params.message_id),
			url: event.url
		});
		return json(sends);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const createdTemplate = await api.create({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			adminId: event.locals.admin.id,
			body
		});
		return json(createdTemplate);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends:POST01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
