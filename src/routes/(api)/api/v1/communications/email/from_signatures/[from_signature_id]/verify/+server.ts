import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as api from '$lib/server/api/communications/email/from_signatures';
import * as m from '$lib/paraglide/messages';

export async function PUT(event) {
	try {
		const verification = await api.testVerificationStatus({
			instanceId: event.locals.instance.id,
			fromSignatureId: Number(event.params.from_signature_id)
		});
		return json(verification);
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
