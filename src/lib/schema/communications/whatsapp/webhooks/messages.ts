import { v, uuid, mediumString, url } from '$lib/schema/valibot';

export const error = v.object({
	code: v.pipe(v.number(), v.integer()),
	title: mediumString,
	message: mediumString,
	error_data: v.object({
		details: mediumString
	})
});

export const messages_type = v.picklist([
	'audio',
	'button',
	'document',
	'text',
	'image',
	'interactive',
	'order',
	'sticker',
	'system',
	'unknown',
	'video'
]);

export const audio = v.object({
	id: mediumString,
	mime_type: mediumString
});

export const button = v.object({
	payload: uuid,
	text: mediumString
});

export const context = v.object({
	forwarded: v.boolean(),
	frequently_forwarded: v.boolean(),
	from: mediumString,
	id: mediumString,
	referred_product: v.optional(
		v.object({
			catalog_id: mediumString,
			product_retailer_id: mediumString
		})
	) //product object describing the product the user is requesting information about. Used for supporting Product Enquiry Messages.
});

export const document = v.object({
	caption: v.optional(mediumString),
	filename: mediumString,
	sha256: mediumString,
	mime_type: mediumString,
	id: mediumString
});

export const identity = v.object({
	hash: mediumString,
	acknowledged: mediumString,
	created_timestamp: mediumString
});

export const image = v.object({
	caption: v.optional(mediumString),
	id: mediumString,
	sha256: mediumString,
	mime_type: mediumString
});

export const interactive = v.object({
	type: v.literal('button_reply'),
	button_reply: v.object({
		id: mediumString, //the uuid: if there is an action, we would search for the wamid.ID of the message, find the message, see if it has a message_id, and then look for actions matching this uuid in the actions record
		title: mediumString
	})
});

export const referral = v.object({
	source_url: url,
	source_type: v.picklist(['ad', 'post']),
	source_id: mediumString,
	headline: mediumString,
	body: mediumString,
	media_type: v.picklist(['image', 'video']),
	image_url: v.optional(url),
	video_url: v.optional(url),
	thumbnail_url: v.optional(url),
	ctwa_clid: v.optional(mediumString)
});

export const sticker = v.object({
	id: mediumString,
	animated: v.boolean(),
	sha256: mediumString,
	mime_type: v.literal('image/webp')
});

export const system = v.object({
	body: mediumString,
	identity: mediumString,
	new_wa_id: v.optional(mediumString),
	wa_id: v.optional(mediumString),
	type: v.picklist(['customer_changed_number', 'customer_identity_changed']),
	customer: mediumString
});

export const text = v.object({
	body: mediumString
});

export const video = v.object({
	id: mediumString,
	mime_type: mediumString,
	sha256: mediumString,
	filename: mediumString,
	caption: v.optional(mediumString)
});

export const order = v.object({
	catalog_id: mediumString,
	text: mediumString,
	product_items: v.array(
		v.object({
			product_retailer_id: mediumString,
			quantity: mediumString,
			item_price: mediumString,
			currency: mediumString
		})
	)
});

export const messageBase = v.object({
	context: v.optional(v.partial(context)),
	errors: v.optional(v.array(error)),
	from: mediumString,
	id: mediumString,
	referral: v.optional(referral),
	timestamp: v.optional(mediumString),
	type: messages_type
});
export type MessageBase = v.InferOutput<typeof messageBase>;

export const messagesTypes = {
	audio: v.object({
		...messageBase.entries,
		type: v.literal('audio'),
		audio: audio
	}),
	button: v.object({
		...messageBase.entries,
		type: v.literal('button'),
		button: button
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
	interactive: v.object({
		...messageBase.entries,
		type: v.literal('interactive'),
		interactive: interactive
	}),
	order: v.object({
		...messageBase.entries,
		type: v.literal('order'),
		order: order
	}),
	sticker: v.object({
		...messageBase.entries,
		type: v.literal('sticker'),
		sticker: sticker
	}),
	system: v.object({
		...messageBase.entries,
		type: v.literal('system'),
		system: system,
		identity: v.optional(identity)
	}),
	text: v.object({
		...messageBase.entries,
		type: v.literal('text'),
		text: text
	}),
	unknown: v.object({
		...messageBase.entries,
		type: v.literal('unknown')
	}),
	video: v.object({
		...messageBase.entries,
		type: v.literal('video'),
		video: video
	})
};

export const message = v.variant('type', [
	messagesTypes.audio,
	messagesTypes.button,
	messagesTypes.document,
	messagesTypes.image,
	messagesTypes.interactive,
	messagesTypes.order,
	messagesTypes.sticker,
	messagesTypes.system,
	messagesTypes.text,
	messagesTypes.unknown,
	messagesTypes.video
]);
export type Message = v.InferOutput<typeof message>;
