import { v, uuid, id, mediumStringNotEmpty } from '$lib/schema/valibot';
import {
	audio,
	document,
	image,
	location,
	text,
	sticker,
	video,
	type,
	template
} from '$lib/schema/communications/whatsapp/elements/media';
import { interactive } from '$lib/schema/communications/whatsapp/elements/interactive';
import { context } from '$lib/schema/communications/whatsapp/elements/reactions';
import { template as templateMessage } from '$lib/schema/communications/whatsapp/elements/template_message';
import {
	conversation,
	yCloudConversation
} from '$lib/schema/communications/whatsapp/webhooks/webhook';

export const allowableTypes = v.picklist(['text', 'image', 'interactive']);
export type AllowableTypes = v.InferOutput<typeof allowableTypes>;

export const messageBase = v.object({
	type: type,
	to: v.string(),
	from: v.string(),
	externalId: uuid, //replaces the biz_opaque_callback_data from the official meta api
	messaging_product: v.optional(v.literal('whatsapp'), 'whatsapp'),
	recipient_type: v.optional(v.literal('individual'), 'individual'),
	context: v.optional(context)
});

export const messageTypes = {
	audio: v.object({
		//...messageBase.entries,
		type: v.literal('audio'),
		audio: audio
	}),
	document: v.object({
		//...messageBase.entries,
		type: v.literal('document'),
		document: document
	}),
	image: v.object({
		//...messageBase.entries,
		type: v.literal('image'),
		image: image
	}),
	location: v.object({
		//...messageBase.entries,
		type: v.literal('location'),
		location: location
	}),
	text: v.object({
		//...messageBase.entries,
		type: v.literal('text'),
		text: text
	}),
	video: v.object({
		//...messageBase.entries,
		type: v.literal('video'),
		video: video
	}),
	sticker: v.object({
		//...messageBase.entries,
		type: v.literal('sticker'),
		sticker: sticker
	}),
	interactive: v.object({
		//...messageBase.entries,
		type: v.literal('interactive'),
		interactive: interactive
	}),
	template: v.object({
		//...messageBase.entries,
		type: v.literal('template'),
		template: template
	})
};
export type TemplateMessage = v.InferOutput<typeof messageTypes.template>;

export const messageTypesWithBase = {
	audio: v.object({
		...messageBase.entries,
		type: v.literal('audio'),
		audio: audio
	}),
	document: v.object({
		...messageBase.entries,
		type: v.literal('document'),
		document: document
	}),
	image: v.object({
		...messageBase.entries,
		type: v.literal('image'),
		image: image
	}),
	location: v.object({
		...messageBase.entries,
		type: v.literal('location'),
		location: location
	}),
	text: v.object({
		...messageBase.entries,
		type: v.literal('text'),
		text: text
	}),
	video: v.object({
		...messageBase.entries,
		type: v.literal('video'),
		video: video
	}),
	sticker: v.object({
		...messageBase.entries,
		type: v.literal('sticker'),
		sticker: sticker
	}),
	interactive: v.object({
		...messageBase.entries,
		type: v.literal('interactive'),
		interactive: interactive
	}),
	template: v.object({
		...messageBase.entries,
		type: v.literal('template'),
		template: template
	})
};
export const messageWithBase = v.variant('type', [
	messageTypesWithBase.audio,
	messageTypesWithBase.document,
	messageTypesWithBase.image,
	messageTypesWithBase.location,
	messageTypesWithBase.text,
	messageTypesWithBase.video,
	messageTypesWithBase.sticker,
	messageTypesWithBase.interactive,
	messageTypesWithBase.template
]);
export type MessageWithBase = v.InferOutput<typeof messageWithBase>;

export const message = v.variant('type', [
	messageTypes.audio,
	messageTypes.document,
	messageTypes.image,
	messageTypes.location,
	messageTypes.text,
	messageTypes.video,
	messageTypes.sticker,
	messageTypes.interactive,
	messageTypes.template
]);
export type Message = v.InferOutput<typeof message>;

export const sendMessage = v.object({
	person_id: id,
	message_id: uuid,
	from_admin_id: id
});
export type SendMessage = v.InferOutput<typeof sendMessage>;

export const successfulResponse = v.object({
	messaging_product: v.literal('whatsapp'),
	contacts: v.array(
		v.object({
			input: v.string(),
			wa_id: v.string()
		})
	),
	messages: v.array(
		v.object({
			id: v.string(),
			message_status: v.optional(v.picklist(['held_for_quality_assessment', 'accepted']))
		})
	)
});

//taken from documentation here: https://docs.ycloud.com/reference/whatsapp_message-send
export const allowableYCloudResponseTypes = v.picklist([...allowableTypes.options, 'template']); //this can also be a template message
export const successfulYCloudResponse = v.object({
	id: mediumStringNotEmpty,
	wamid: v.optional(mediumStringNotEmpty),
	wabaId: mediumStringNotEmpty,
	from: mediumStringNotEmpty,
	to: mediumStringNotEmpty,
	type: allowableYCloudResponseTypes,
	conversation: v.optional(conversation),
	text: v.optional(text),
	image: v.optional(image),
	audio: v.optional(audio),
	interactive: v.optional(interactive),
	template: v.optional(templateMessage),
	context: v.optional(context),
	externalId: v.optional(mediumStringNotEmpty),
	status: v.picklist(['accepted', 'failed', 'sent', 'delivered', 'read']),
	errorCode: v.optional(v.string()),
	errorMessage: v.optional(v.string()),
	createTime: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	updateTime: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	sendTime: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	deliverTime: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	readTime: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	totalPrice: v.optional(v.number()),
	regionCode: v.optional(mediumStringNotEmpty),
	currency: v.optional(mediumStringNotEmpty),
	pricingCategory: v.optional(
		v.picklist([
			'referral_conversion',
			'authentication',
			'authentication_international',
			'marketing',
			'utility',
			'service'
		])
	),
	whatsappApiError: v.optional(
		v.object({
			message: v.string(),
			code: v.string(),
			type: v.optional(v.string()),
			error_subcode: v.optional(v.string()),
			error_user_msg: v.optional(v.string()),
			fbtrace_id: v.optional(v.string()),
			error_data: v.optional(v.any())
		})
	),
	bizType: v.optional(v.literal('whatsapp'))
});
