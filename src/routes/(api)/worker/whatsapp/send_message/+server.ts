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
import { read } from '$lib/server/api/people/people';

import type { AfterSend } from '$lib/schema/communications/whatsapp/worker/sending.js';
const log = pino('/worker/whatsapp/send_message');
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
					messageId: messageId,
					t: event.locals.t
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

		if (!person.phone_number?.phone_number) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:01',
				event.locals.t.errors.generic()
			);
		}
		const parsedPhoneNumberTo = parsePhoneNumber(person.phone_number.phone_number, {
			regionCode: person.phone_number.country
		});
		if (!parsedPhoneNumberTo.valid) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:01',
				event.locals.t.errors.generic()
			);
		}

		if (!PHONE_NUMBER_ID) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:01',
				event.locals.t.errors.generic()
			);
		}
		const parsedPhoneNumberFrom = parsePhoneNumber(PHONE_NUMBER_ID, {
			regionCode: person.phone_number.country
		});
		if (!parsedPhoneNumberFrom.valid) {
			throw new BelcodaError(
				400,
				'DATA:/whatsapp/send_message/+server.ts:01',
				event.locals.t.errors.generic()
			);
		}
		const messageBody: MessageWithBase = {
			to: parsedPhoneNumberTo.number.e164.replace('+', ''), //whatsapp only accepts without the +
			from: parsedPhoneNumberFrom.number.e164.replace('+', ''),
			biz_opaque_callback_data: messageId,
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			...messageObj.message
		};
		//using the ycloud api
		const externalId = randomUUID();
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
		//using the graph api directly...
		/* const response = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
			body: JSON.stringify(messageBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${WHATSAPP_ACCESS_KEY}`
			},
			method: 'POST'
		}); */
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
			console.log('Whatsapp responded with an error');
			console.log(response.status);
			console.log(await response.json());
		}
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/whatsapp/send_message/+server.ts',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
