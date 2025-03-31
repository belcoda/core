import {
	v,
	shortStringNotEmpty,
	mediumString,
	isoTimestamp,
	mediumStringNotEmpty
} from '$lib/schema/valibot';
import * as wb from '$lib/schema/communications/whatsapp/webhooks/messages';
export const base = v.object({
	id: shortStringNotEmpty,
	apiVersion: v.literal('v2'),
	createTime: isoTimestamp
});

export const whatsAppBusinessAccountDeleted = v.object({
	...base.entries,
	type: v.literal('whatsapp.business_account.deleted'),
	whatsappBusinessAccount: v.object({
		id: shortStringNotEmpty,
		name: mediumStringNotEmpty
	})
});

export const whatsAppBusinessAccountUpdated = v.object({
	...base.entries,
	type: v.literal('whatsapp.business_account.updated'),
	whatsappBusinessAccount: v.object({
		id: shortStringNotEmpty,
		name: mediumStringNotEmpty
		//other fields as well, but not included here. See https://docs.ycloud.com/reference/whatsapp-business-account-updated-webhook-examples
	})
});

export const whatsappInboundMessage = v.object({
	...wb.messageBase.entries,
	id: shortStringNotEmpty,
	wabaId: shortStringNotEmpty,
	from: shortStringNotEmpty,
	customerProfile: v.object({
		name: mediumString
	}),
	to: shortStringNotEmpty,
	sendTime: isoTimestamp,
	type: wb.messages_type,
	audio: v.optional(wb.audio),
	button: v.optional(wb.button),
	document: v.optional(wb.document),
	text: v.optional(wb.text),
	image: v.optional(wb.image),
	interactive: v.optional(wb.interactive),
	order: v.optional(wb.order),
	sticker: v.optional(wb.sticker),
	system: v.optional(wb.system),
	video: v.optional(wb.video)
});
export type WhatsappInboundMessage = v.InferOutput<typeof whatsappInboundMessage>;

export const whatsappInboundMessageReceived = v.object({
	...base.entries,
	type: v.literal('whatsapp.inbound_message.received'),
	whatsappInboundMessage: v.object(whatsappInboundMessage.entries)
});
export type WhatsappInboundMessageReceived = v.InferOutput<typeof whatsappInboundMessageReceived>;

import { successfulYCloudResponse as importedYCloudMessageObject } from '$lib/schema/communications/whatsapp/elements/message';
export const whatsappMessageUpdated = v.object({
	...base.entries,
	type: v.literal('whatsapp.message.updated'),
	whatsappMessage: importedYCloudMessageObject
});

export const yCloudWebhook = v.variant('type', [
	whatsAppBusinessAccountDeleted,
	whatsAppBusinessAccountUpdated,
	whatsappInboundMessageReceived,
	whatsappMessageUpdated
]);

export type YCloudWebhook = v.InferOutput<typeof yCloudWebhook>;
