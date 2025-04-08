import { json, error, BelcodaError, pino } from '$lib/server';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { randomUUID } from 'crypto';
import {
	successfulYCloudResponse,
	sendMessage,
	type MessageWithBase,
	type Message
} from '$lib/schema/communications/whatsapp/elements/message';
import { read as readMessage } from '$lib/server/api/communications/whatsapp/messages';
import { parse } from '$lib/schema/valibot';
import { _readSecretsUnsafe } from '$lib/server/api/core/instances';
import { _updateWhatsappId, read } from '$lib/server/api/people/people';
import * as m from '$lib/paraglide/messages';
import type { AfterSend } from '$lib/schema/communications/whatsapp/worker/sending.js';
const log = pino(import.meta.url);
export async function POST(event) {
	try {
		const body = await event.request.json();

		// Handle both formats: one with message_id and one with direct message object
		let messageId: string;
		let personId: number;
		let fromAdminId: number;
		let messageObj: { message: Message };

		// Check if we have a direct message object or a message_id
		if (body.message) {
			personId = body.person_id;
			fromAdminId = event.locals.admin.id;
			messageId = '-1';
			messageObj = { message: body.message };
		} else {
			// For messages that are already in the database
			try {
				const parsedMessage = parse(sendMessage, body);
				personId = parsedMessage.person_id;
				messageId = parsedMessage.message_id;
				fromAdminId = parsedMessage.from_admin_id;

				messageObj = await readMessage({
					instanceId: event.locals.instance.id,
					messageId: messageId
				});
			} catch (err) {
				throw new BelcodaError(
					400,
					'DATA:/whatsapp/send_message/+server.ts:02',
					event.locals.t.errors.generic(),
					err
				);
			}
		}

		const { WHATSAPP_ACCESS_KEY } = await _readSecretsUnsafe({
			instanceId: event.locals.instance.id
		});
		const PHONE_NUMBER_ID = event.locals.instance.settings.communications.whatsapp.phone_number_id;
		const person = await read({
			instance_id: event.locals.instance.id,
			person_id: personId,
			t: event.locals.t
		});
		await readMessage({
			instanceId: event.locals.instance.id,
			messageId: messageId
		});

		if (!person.phone_number?.phone_number) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:01',
				m.teary_dizzy_earthworm_urge()
			);
		}
		const parsedPhoneNumberTo = parsePhoneNumber(person.phone_number.phone_number, {
			regionCode: person.phone_number.country
		});
		if (!parsedPhoneNumberTo.valid) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:02',
				m.teary_dizzy_earthworm_urge()
			);
		}

		if (!PHONE_NUMBER_ID) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:03',
				m.teary_dizzy_earthworm_urge()
			);
		}
		//using the ycloud api
		const externalId = randomUUID();
		const messageBody: MessageWithBase = {
			to: parsedPhoneNumberTo.number.e164.replace('+', ''), //whatsapp only accepts without the +
			from: PHONE_NUMBER_ID, //we don't need to do any parsing of the instance phone number. It should be set correctly in the settings.
			biz_opaque_callback_data: externalId,
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			...messageObj.message
		};

		const response = await fetch(`https://api.ycloud.com/v2/whatsapp/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-API-Key': WHATSAPP_ACCESS_KEY
			},
			body: JSON.stringify({
				externalId,
				...messageBody
			})
		});
		log.debug(messageBody, 'the messge we send to the api');

		if (response.ok) {
			const responseBody = await response.json();
			log.debug(responseBody);
			const parsed = parse(successfulYCloudResponse, responseBody);

			const afterSendBody: AfterSend = {
				message_id: messageId,
				sent_by_id: fromAdminId,
				person_id: personId,
				message: messageObj.message,
				uniqueId: externalId,
				whatsapp_response: parsed
			};
			await event.locals.queue(
				'/whatsapp/after_sent_ycloud',
				event.locals.instance.id,
				afterSendBody,
				event.locals.admin.id
			);
		} else {
			log.error('Whatsapp responded with an error');
			log.error(await response.json());
			log.error(response.status);
			log.error('End whatsapp error');
		}
		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/whatsapp/send_message/+server.ts:05', m.spry_ago_baboon_cure(), err);
	}
}
