import { BelcodaError, pino } from '$lib/server';
import { parsePhoneNumber } from 'awesome-phonenumber';

import { parse } from '$lib/schema/valibot';
import {
	successfulYCloudResponse,
	type SuccessfulYCloudResponse,
	type SendMessage,
	type MessageWithBase
} from '$lib/schema/communications/whatsapp/elements/message';
import { type Read as ReadMessage } from '$lib/schema/communications/whatsapp/messages';
import { type Read as ReadPerson } from '$lib/schema/people/people';
import type { InteractionTypeOutboundWhatsapp } from '$lib/schema/people/interactions';
import { type Read as ReadTemplate } from '$lib/schema/communications/whatsapp/template';
import { type Create as CreateInteraction } from '$lib/schema/people/interactions';

import { read as readMessage } from '$lib/server/api/communications/whatsapp/messages';
import { _readSecretsUnsafe } from '$lib/server/api/core/instances';
import { _updateWhatsappId } from '$lib/server/api/people/people';
import { _getThreadByStartingMessageId } from '$lib/server/api/communications/whatsapp/threads';
import { read as readTemplate } from '$lib/server/api/communications/whatsapp/templates';
import { create as createInteraction } from '$lib/server/api/people/interactions';

import * as m from '$lib/paraglide/messages';

const log = pino(import.meta.url);

export async function sendNextMessageIfExists({
	instanceId,
	t,
	message,
	adminId,
	personId,
	queue
}: {
	instanceId: number;
	t: App.Localization;
	personId: number;
	queue: App.Queue;
	adminId: number;
	message: ReadMessage;
}): Promise<void> {
	const nextMessage = message.next;
	if (!nextMessage) {
		return;
	}
	log.debug(`Ready to queue sending next message ${nextMessage}`);
	const nextMessageResponse = await readMessage({
		instanceId: instanceId,
		messageId: nextMessage
	});
	if (!nextMessageResponse) {
		log.error(`Next message ${nextMessage} not found`);
		return;
	}

	const sendMessageBody: SendMessage = {
		person_id: personId,
		message_id: nextMessageResponse.id,
		from_admin_id: adminId
	};

	await queue('/worker/whatsapp/send_message', instanceId, sendMessageBody, adminId);
	log.debug(sendMessageBody, `Successfully queued next message`);
}

export async function recordInteraction({
	message,
	instanceId,
	t,
	adminId,
	personId,
	sentMessageId
}: {
	message: ReadMessage;
	instanceId: number;
	adminId: number;
	personId: number;
	t: App.Localization;
	sentMessageId: string;
}): Promise<void> {
	const details = await createInteractionDetails({
		message,
		instanceId,
		sentMessageId,
		t
	});
	const interaction: CreateInteraction = {
		person_id: personId,
		admin_id: adminId,
		details: details
	};
	await createInteraction({
		instanceId: instanceId,
		body: interaction,
		t: t
	});
}

export async function createInteractionDetails({
	message,
	instanceId,
	sentMessageId,
	t
}: {
	message: ReadMessage;
	instanceId: number;
	sentMessageId: string;
	t: App.Localization;
}): Promise<InteractionTypeOutboundWhatsapp> {
	//template message interactions have a slightly different schema because they need to bring in the template message too to render properly
	if (message.message.type === 'template') {
		const template = await readTemplateMessage({
			instanceId: instanceId,
			messageId: message.id,
			t: t
		});
		const details: InteractionTypeOutboundWhatsapp = {
			type: 'outbound_whatsapp',
			message_id: sentMessageId,
			message: message.message,
			template: template.message
		};
		return details;
	} else {
		const details: InteractionTypeOutboundWhatsapp = {
			type: 'outbound_whatsapp',
			message_id: message.id,
			message: message.message
		};
		return details;
	}
}

export async function readTemplateMessage({
	instanceId,
	messageId,
	t
}: {
	instanceId: number;
	messageId: string;
	t: App.Localization;
}): Promise<ReadTemplate> {
	log.debug(`Reading template for message ${messageId}`);
	const thread = await _getThreadByStartingMessageId({
		instanceId: instanceId,
		startingMessageId: messageId
	});
	const template = await readTemplate({
		instanceId: instanceId,
		templateId: thread.template_id
	});
	return template;
}

export async function sendMessageToYCloud({
	person,
	message,
	phoneNumber,
	instanceId,
	sentMessageId
}: {
	person: ReadPerson;
	message: ReadMessage;
	phoneNumber: string;
	instanceId: number;
	sentMessageId: string; //the UUID that will be kept as the sent message ID.
}): Promise<SuccessfulYCloudResponse> {
	log.debug(
		`Sending message ${message.id} to person id ${person.id} [${person.phone_number?.phone_number}] from ${phoneNumber}`
	);
	if (!person.phone_number?.phone_number) {
		log.debug(person.phone_number, `No phone number found for person ${person.id}`);
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
		log.debug(parsedPhoneNumberTo, 'Invalid phone number');
		throw new BelcodaError(
			400,
			'DATA:/whatsapp/send_message/+server.ts:02',
			m.teary_dizzy_earthworm_urge()
		);
	}

	if (!phoneNumber) {
		log.debug(
			`No WhatsApp phone number found for sending message ${message.id} to person id ${person.id}`
		);
		throw new BelcodaError(
			400,
			'DATA:/whatsapp/send_message/+server.ts:03',
			m.teary_dizzy_earthworm_urge()
		);
	}

	const { WHATSAPP_ACCESS_KEY } = await _readSecretsUnsafe({
		instanceId
	});

	if (!WHATSAPP_ACCESS_KEY) {
		log.debug('No WhatsApp access key found');
		throw new BelcodaError(
			400,
			'DATA:/whatsapp/send_message/+server.ts:04',
			m.teary_dizzy_earthworm_urge()
		);
	}

	const messageBody: MessageWithBase = {
		to: parsedPhoneNumberTo.number.e164.replace('+', ''), //whatsapp only accepts without the +
		from: phoneNumber, //we don't need to do any parsing of the instance phone number. It should be set correctly in the settings.
		externalId: sentMessageId,
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
		...message.message
	};

	// this queues the message at the ycloud api end...
	const response = await fetch(`https://api.ycloud.com/v2/whatsapp/messages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
			'X-API-Key': WHATSAPP_ACCESS_KEY
		},
		body: JSON.stringify({
			...messageBody
		})
	});
	log.debug(messageBody, 'the messge we send to the api');

	if (!response.ok) {
		log.error(await response.json(), `YCloud API responded with an error [${response.status}`);
		throw new Error('YCloud API responded with an error');
	}
	//response is ok.

	const ycloudResponseBody = await response.json();
	log.debug(ycloudResponseBody, 'Successful response from YCloud API');

	const parsedResponse = parse(successfulYCloudResponse, ycloudResponseBody);
	return parsedResponse;
}
