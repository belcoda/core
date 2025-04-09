import { v, mediumString, uuid } from '$lib/schema/valibot';
import { message, error } from '$lib/schema/communications/whatsapp/webhooks/messages';

export const contact = v.object({
	wa_id: mediumString,
	profile: v.object({
		name: mediumString
	})
});

export const conversation_category = v.picklist([
	'authentication',
	'marketing',
	'utility',
	'service',
	'referral_conversion'
]);

export const metadata = v.object({
	display_phone_number: mediumString,
	phone_number_id: mediumString //this reference to phone_number_id is for the meta whatsapp api and not relevant for ycloud
});

export const whatsappApiConversation = v.object({
	id: mediumString,
	origin: v.object({
		type: conversation_category
	}),
	expiration_timestamp: v.optional(
		v.pipe(
			v.union([v.string(), v.number()]),
			v.transform((input) => Number(input)),
			v.number(),
			v.integer()
		)
	)
});

export const yCloudConversation = v.pipe(
	v.object({
		id: v.string(),
		type: v.string(),
		originType: conversation_category,
		expireTime: v.optional(
			v.pipe(
				v.union([v.string(), v.number()]),
				v.transform((input) => {
					if (typeof input === 'string') {
						return new Date(input).getTime();
					} else {
						return Number(input);
					}
				}),
				v.number(),
				v.integer()
			)
		)
	}),
	v.transform((input) => {
		return {
			id: input.id,
			origin: {
				type: input.originType
			},
			expiration_timestamp: input.expireTime
		};
	})
);

export const conversation = v.union([whatsappApiConversation, yCloudConversation]);
export type ConversationInput = v.InferInput<typeof conversation>;
export type Conversation = v.InferOutput<typeof conversation>;

export const status = v.object({
	id: mediumString,
	status: v.picklist(['sent', 'delivered', 'read']),
	timestamp: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((input) => Number(input)),
		v.number(),
		v.integer()
	),
	recipient_id: mediumString,
	biz_opaque_callback_data: v.optional(uuid),
	conversation: v.optional(conversation),
	errors: v.optional(v.array(error)),
	pricing: v.optional(
		v.object({
			pricing: v.optional(v.boolean(), true),
			category: conversation_category,
			pricing_model: v.literal('CBP')
		})
	)
});

export const webhook = v.object({
	object: v.literal('whatsapp_business_account'),
	entry: v.array(
		v.object({
			id: mediumString, //WHATSAPP_BUSINESS_ACCOUNT_ID
			changes: v.array(
				v.object({
					field: v.literal('messages'),
					value: v.object({
						contacts: v.optional(v.array(contact)),
						errors: v.optional(v.array(error)),
						messaging_product: v.literal('whatsapp'),
						messages: v.optional(v.array(message)),
						metadata: metadata,
						statuses: v.optional(v.array(status))
					})
				})
			)
		})
	)
});
export type Webhook = v.InferOutput<typeof webhook>;
