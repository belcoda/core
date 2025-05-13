import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as api from '$lib/server/api/communications/email/from_signatures';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const list = await api.read({
			instanceId: event.locals.instance.id,
			fromSignatureId: Number(event.params.from_signature_id)
		});
		return json(list);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/from_signatures/[from_signature_id]:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const updated = await api.update({
			instanceId: event.locals.instance.id,
			fromSignatureId: Number(event.params.from_signature_id),
			body
		});
		return json(updated);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/from_signatures/[from_signature_id]:PUT',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const deleted = await api.del({
			instanceId: event.locals.instance.id,
			fromSignatureId: Number(event.params.from_signature_id)
		});
		return json(deleted);
	} catch (err) {
		log.error(err);
		return error(
			500,
			'API:/api/v1/communications/emails/from_signatures/[from_signature_id]:DELETE',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
