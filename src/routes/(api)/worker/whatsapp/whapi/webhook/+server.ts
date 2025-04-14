import { json, error, BelcodaError } from '$lib/server';

import { incomingWebhook } from '$lib/schema/communications/whatsapp/whapi/incoming';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import { pino } from '$lib/server';
import { _getGroupByWhatsappId } from '$lib/server/api/people/groups';
import { _getPersonByWhatsappId } from '$lib/server/api/people/people';
import convertWebhookMessage from './convertMessages';

import { create } from '$lib/server/api/communications/whatsapp/received_whatsapp_group_messages';
import { type Create } from '$lib/schema/communications/whatsapp/received_whatsapp_group_messages';

const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const body = await event.request.json();
		log.debug(body);
		log.debug(event.locals.instance.id);
		log.debug(event.locals.admin.id);
		const parsed = parse(incomingWebhook, body);
		log.debug(parsed);
		//get the message
		if (!Array.isArray(parsed.messages) || parsed.messages.length <= 0) {
			throw new BelcodaError(
				400,
				'WORKER:/worker/whatsapp/whapi/webhook:POST:02',
				'No messages found in the webhook'
			);
		}

		const message = parsed.messages[0];
		//get group by chat ID...
		const group = await _getGroupByWhatsappId({
			instanceId: event.locals.instance.id,
			whatsappId: message.chat_id
		});
		log.debug(group.id);
		//get person by phone number or whatsapp ID...
		const person = await _getPersonByWhatsappId({
			instanceId: event.locals.instance.id,
			whatsappId: message.from
		});
		log.debug(person.id);

		//convert thr webhook to a message
		const converted = convertWebhookMessage(parsed);
		log.debug(converted);
		//save the message to the database...
		const createBody: Create = {
			group_id: group.id,
			person_id: person.id,
			message: converted,
			platform: 'whapi.cloud'
		};
		const created = await create({
			instanceId: event.locals.instance.id,
			groupId: group.id,
			personId: person.id,
			body: createBody,
			t: event.locals.t
		});

		log.debug(created);

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/worker/whatsapp/whapi/webhook:POST:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
