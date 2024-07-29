import {
	v,
	shortString,
	longString,
	timestamp,
	uuid,
	id,
	shortStringNotEmpty
} from '$lib/schema/valibot';

import { message as whatsappMessage } from '$lib/schema/communications/whatsapp/elements/message';

export const addedAndJoinedTypes = {
	manual: v.object({ method: v.literal('manual') }),
	import: v.object({ method: v.literal('import') }),
	petition_signature: v.object({
		method: v.literal('petition_signature'),
		petition_id: id,
		petition_name: shortString
	}),
	event_registration: v.object({
		method: v.literal('event_registration'),
		event_id: id,
		event_name: shortString
	}),
	website_signup: v.object({
		method: v.literal('website_signup'),
		content_id: id,
		content_type_id: id,
		content_type_name: shortString,
		content_name: shortString
	}),
	other: v.object({ method: v.literal('other') })
};

export const personJoinedType = v.variant('method', [
	addedAndJoinedTypes.petition_signature,
	addedAndJoinedTypes.event_registration,
	addedAndJoinedTypes.other
]);
export type PersonJoinedType = v.InferOutput<typeof personJoinedType>;

export const personAddedType = v.variant('method', [
	addedAndJoinedTypes.manual,
	addedAndJoinedTypes.import,
	addedAndJoinedTypes.petition_signature,
	addedAndJoinedTypes.event_registration,
	addedAndJoinedTypes.other
]);

export const interactionTypes = {
	added: v.object({
		type: v.literal('person_added'),
		details: personAddedType
	}),
	joined: v.object({
		type: v.literal('person_joined'),
		details: personJoinedType
	}),
	user_details_updated: v.object({
		type: v.literal('user_details_updated'),
		method: v.picklist(['manual', 'petition_signature', 'website_signup', 'event_registration'])
	}),
	notes: v.object({
		type: v.literal('notes'),
		notes: longString
	}),
	phone_call_outbound: v.object({
		type: v.literal('phone_call_outbound'),
		notes: longString
	}),
	phone_call_inbound: v.object({
		type: v.literal('phone_call_inbound'),
		notes: longString
	}),
	outbound_whatsapp: v.object({
		type: v.literal('outbound_whatsapp'),
		message_id: uuid,
		message: whatsappMessage
	}),
	inbound_whatsapp: v.object({
		type: v.literal('inbound_whatsapp'),
		message_id: uuid,
		message: whatsappMessage
	}),
	email_outbound: v.object({
		type: v.literal('email_outbound'),
		subject: shortString,
		message: longString,
		message_id: id
	}),
	email_inbound: v.object({
		type: v.literal('email_inbound'),
		subject: shortString,
		message: longString
	}),
	signed_petition: v.object({
		type: v.literal('signed_petition'),
		method: v.picklist(['manual', 'website', 'other']),
		petition_id: id,
		petition_name: shortStringNotEmpty
	}),
	registered_for_event: v.object({
		type: v.literal('registered_for_event'),
		method: v.picklist(['manual', 'website', 'other']),
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	cancelled_event_registration: v.object({
		type: v.literal('cancelled_event_registration'),
		method: v.picklist(['manual', 'website', 'other']),
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	attended_event: v.object({
		type: v.literal('attended_event'),
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	noshow_event: v.object({
		type: v.literal('noshow_event'),
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	received_event_followup_email: v.object({
		type: v.literal('received_event_followup_email'),
		message_id: id,
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	received_event_reminder_email: v.object({
		type: v.literal('received_event_reminder_email'),
		message_id: id,
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	received_event_cancellation_email: v.object({
		type: v.literal('received_event_cancellation_email'),
		message_id: id,
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	received_event_registration_email: v.object({
		type: v.literal('received_event_registration_email'),
		message_id: id,
		event_id: id,
		event_name: shortStringNotEmpty
	}),
	received_petition_autoresponse_email: v.object({
		type: v.literal('received_petition_autoresponse_email'),
		petition_name: shortStringNotEmpty,
		message_id: id,
		petition_id: id
	}),
	whatsapp_verified: v.object({
		type: v.literal('whatsapp_verified'),
		phone_number: shortStringNotEmpty
	}),
	added_to_list: v.object({
		type: v.literal('added_to_list'),
		list_name: shortStringNotEmpty,
		list_id: id
	}),
	removed_from_list: v.object({
		type: v.literal('removed_from_list'),
		list_name: shortStringNotEmpty,
		list_id: id
	}),
	added_tag: v.object({
		type: v.literal('added_tag'),
		tag_name: shortStringNotEmpty,
		tag_id: id
	}),
	removed_tag: v.object({
		type: v.literal('removed_tag'),
		tag_name: shortStringNotEmpty,
		tag_id: id
	}),
	added_to_group: v.object({
		type: v.literal('added_to_group'),
		group_name: shortStringNotEmpty,
		group_id: id
	}),
	removed_from_group: v.object({
		type: v.literal('removed_from_group'),
		group_name: shortStringNotEmpty,
		group_id: id
	})
};

export const interactionType = v.variant('type', Array.from(Object.values(interactionTypes)));
export type InteractionType = v.InferOutput<typeof interactionType>;
import { read as readAdmin } from '$lib/schema/core/admin';

export const base = v.object({
	id: id,
	instance_id: id,
	person_id: id,
	admin_id: id,
	details: interactionType,
	created_at: timestamp
});

export const read = v.object({
	id: base.entries.id,
	person_id: base.entries.person_id,
	admin: readAdmin,
	details: base.entries.details,
	created_at: base.entries.created_at
});
export type Read = v.InferOutput<typeof read>;

export const list = v.array(read);
export type List = v.InferOutput<typeof list>;

export const create = v.omit(base, ['id', 'instance_id', 'created_at']);
export type Create = v.InferOutput<typeof create>;
