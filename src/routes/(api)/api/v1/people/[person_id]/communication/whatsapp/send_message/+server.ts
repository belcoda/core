import { pino, json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { getActiveForPerson } from '$lib/server/api/communications/whatsapp/conversations';
import { create } from '$lib/server/api/communications/whatsapp/messages';
import { type Create } from '$lib/schema/communications/whatsapp/messages';

const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const body = await event.request.json();
		log.debug(body);
		const bodyMessage = body.details.message;
		if (typeof bodyMessage !== 'string') {
			return error(
				400,
				'DATA:/api/v1/people/[person_id]/communications/whatsapp/send_message/+server.ts:02',
				m.zippy_weird_hound_expand()
			);
		}
		const personId = Number(event.params.person_id);
		log.debug(personId);
		const conversation = await getActiveForPerson({
			instanceId: event.locals.instance.id,
			personId,
			t: event.locals.t
		});
		log.debug(conversation);
		if (!conversation) {
			return error(
				400,
				'DATA:/api/v1/people/[person_id]/communications/whatsapp/send_message/+server.ts:03',
				m.main_strong_octopus_roam()
			);
		}

		const messageBody: Create = {
			message: {
				type: 'text',
				text: {
					body: bodyMessage
				}
			}
		};
		const message = await create({ instanceId: event.locals.instance.id, body: messageBody });
		const sendMessageBody = {
			person_id: personId,
			message_id: message.id,
			from_admin_id: event.locals.admin.id
		};
		await event.locals.queue(
			'whatsapp/send_message',
			event.locals.instance.id,
			sendMessageBody,
			event.locals.admin.id
		);

		const messageReturn = {
			message_id: message.id,
			message: message.message
		};

		log.debug(messageReturn);

		return json(messageReturn);
	} catch (err) {
		return error(
			500,
			'DATA:/api/v1/people/[person_id]/communications/whatsapp/send_message/+server.ts:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
