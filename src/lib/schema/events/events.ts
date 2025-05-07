import {
	v,
	longString,
	timestamp,
	id,
	address,
	count,
	shortStringNotEmpty,
	longStringNotEmpty,
	DEFAULT_CUSTOM_CODE,
	DEFAULT_HTML_METATAGS,
	phoneNumber,
	country,
	url,
	slug,
	customCode,
	htmlMetatags,
	timestampNoDefault
} from '$lib/schema/valibot';

import { read as readAdmin } from '$lib/schema/core/admin';

import { create as createPerson, read as readPerson } from '$lib/schema/people/people';
import { read as readInstance } from '$lib/schema/core/instance';
import { read as readEmailMessage } from '$lib/schema/communications/email/messages';
import { timezone } from '../utils/datetime';

export const eventUserInfoSettings = v.object({
	ask_email: v.boolean(),
	ask_phone_number: v.boolean(),
	ask_postcode: v.boolean(),
	ask_address: v.boolean(),
	require_email: v.boolean(),
	require_phone_number: v.boolean(),
	require_postcode: v.boolean(),
	require_address: v.boolean()
});

export const base = v.object({
	id: id,
	instance_id: id,
	name: longStringNotEmpty,
	slug: slug,
	heading: shortStringNotEmpty,
	html: longStringNotEmpty,
	starts_at: timestamp,
	ends_at: timestamp,
	timezone: v.optional(timezone, 'Etc/UTC'),
	online: v.boolean(),
	online_url: v.nullable(url),
	online_instructions: v.nullable(longString),
	max_attendees: v.nullable(v.pipe(v.number(), v.integer())),
	...address.entries,

	...eventUserInfoSettings.entries,

	registration_email: id,
	reminder_email: id,
	cancellation_email: id,
	followup_email: id,

	send_registration_email: v.boolean(),
	send_reminder_email: v.boolean(),
	send_cancellation_email: v.boolean(),
	send_followup_email: v.boolean(),
	reminder_sent_at: v.nullable(timestamp),
	followup_sent_at: v.nullable(timestamp),
	send_reminder_hours_before_start: v.pipe(v.number(), v.integer(), v.minValue(0)),
	send_followup_hours_after_end: v.pipe(v.number(), v.integer(), v.minValue(0)),

	feature_image_upload_id: v.nullable(id),

	point_person_id: id,
	custom_code: customCode,
	html_metatags: htmlMetatags,

	active: v.boolean(),
	created_at: timestamp,
	updated_at: timestamp,
	published_at: v.nullable(timestamp)
});
import { read as readUpload } from '$lib/schema/website/uploads';

export const read = v.object({
	...v.omit(base, [
		'instance_id',
		'point_person_id',
		'reminder_email',
		'registration_email',
		'followup_email',
		'cancellation_email'
	]).entries,
	point_person: readAdmin,
	reminder_email: readEmailMessage,
	registration_email: readEmailMessage,
	followup_email: readEmailMessage,
	cancellation_email: readEmailMessage,
	registered: count,
	attended: count,
	cancelled: count,
	feature_image: v.nullable(readUpload),
	noshow: count
});
export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	items: v.array(
		v.omit(read, [
			'html',
			'custom_code',
			'html_metatags',
			'reminder_email',
			'cancellation_email',
			'registration_email',
			'followup_email',
			'feature_image'
		])
	),
	count: count
});
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	name: v.optional(base.entries.name),
	slug: v.optional(base.entries.slug),
	heading: base.entries.heading,
	html: base.entries.html,
	starts_at: base.entries.starts_at,
	ends_at: base.entries.ends_at,
	timezone: base.entries.timezone,
	...v.partial(eventUserInfoSettings).entries,

	online: v.optional(base.entries.online, false),
	online_url: v.optional(base.entries.online_url),
	online_instructions: v.optional(base.entries.online_instructions),

	registration_email: v.optional(base.entries.registration_email),
	reminder_email: v.optional(base.entries.reminder_email),
	cancellation_email: v.optional(base.entries.cancellation_email),
	followup_email: v.optional(base.entries.followup_email),

	send_registration_email: v.optional(base.entries.send_registration_email, true),
	send_reminder_email: v.optional(base.entries.send_registration_email, true),
	send_cancellation_email: v.optional(base.entries.send_registration_email, true),
	send_followup_email: v.optional(base.entries.send_registration_email, false),
	send_reminder_hours_before_start: v.optional(base.entries.send_reminder_hours_before_start, 24),
	send_followup_hours_after_end: v.optional(base.entries.send_followup_hours_after_end, 24),

	feature_image_upload_id: v.optional(base.entries.feature_image_upload_id),

	max_attendees: v.optional(base.entries.max_attendees),

	point_person_id: v.optional(base.entries.point_person_id),

	custom_code: v.optional(base.entries.custom_code, DEFAULT_CUSTOM_CODE),
	html_metatags: v.optional(base.entries.html_metatags, DEFAULT_HTML_METATAGS),

	...v.partial(address).entries
});
export type Create = v.InferOutput<typeof create>;

export const update = v.object({
	...v.partial(
		v.omit(create, ['registration_email', 'cancellation_email', 'followup_email', 'reminder_email'])
	).entries,
	followup_sent_at: v.optional(base.entries.followup_sent_at),
	reminder_sent_at: v.optional(base.entries.reminder_sent_at)
});
export type Update = v.InferOutput<typeof update>;

export const eventSignup = v.object({
	family_name: createPerson.entries.family_name,
	family_name_alt: createPerson.entries.family_name_alt,
	given_name: createPerson.entries.given_name,
	full_name: createPerson.entries.full_name,
	given_name_alt: createPerson.entries.given_name_alt,
	email: v.optional(v.nullable(v.pipe(v.string(), v.email())), null),
	phone_number: v.optional(v.nullable(phoneNumber), null),
	address_line_1: createPerson.entries.address_line_1,
	address_line_2: createPerson.entries.address_line_2,
	address_line_3: createPerson.entries.address_line_3,
	address_line_4: createPerson.entries.address_line_4,
	locality: createPerson.entries.locality,
	state: createPerson.entries.state,
	postcode: createPerson.entries.postcode,
	country: country,
	opt_in: v.optional(v.boolean(), false)
});
export type EventSignup = v.InferOutput<typeof eventSignup>;
export type SignupQueueMessage = v.InferOutput<typeof signUpQueueMessage>;

export const signUpQueueMessage = v.object({
	event_id: id,
	signup: eventSignup
});
