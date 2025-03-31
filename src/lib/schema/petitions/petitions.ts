import {
	v,
	timestamp,
	id,
	count,
	shortStringNotEmpty,
	longStringNotEmpty,
	DEFAULT_CUSTOM_CODE,
	longString,
	DEFAULT_HTML_METATAGS,
	slug,
	phoneNumber,
	country,
	customCode,
	htmlMetatags,
	mediumStringNotEmpty
} from '$lib/schema/valibot';

import { read as readAdmin } from '$lib/schema/core/admin';

import { create as createPerson, read as readPerson } from '$lib/schema/people/people';
import { read as readInstance } from '$lib/schema/core/instance';
import { read as readEmailMessage } from '$lib/schema/communications/email/messages';

export const petitionUserInfoSettings = v.object({
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
	petition_target: shortStringNotEmpty,
	petition_text: mediumStringNotEmpty,

	...petitionUserInfoSettings.entries,
	feature_image_upload_id: v.nullable(id),

	autoresponse_email: id,
	send_autoresponse_email: v.boolean(),

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
	...v.omit(base, ['instance_id', 'point_person_id', 'autoresponse_email']).entries,
	point_person: readAdmin,
	autoresponse_email: readEmailMessage,
	signatures: count,
	feature_image: v.nullable(readUpload)
});
export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	items: v.array(
		v.omit(read, ['html', 'custom_code', 'html_metatags', 'autoresponse_email', 'feature_image'])
	),
	count: count
});
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	name: v.optional(base.entries.name),
	slug: v.optional(base.entries.slug),
	heading: base.entries.heading,
	html: base.entries.html,
	petition_target: base.entries.petition_target,
	petition_text: base.entries.petition_text,
	...v.partial(petitionUserInfoSettings).entries,

	autoresponse_email: v.optional(base.entries.autoresponse_email),
	send_autoresponse_email: v.optional(base.entries.send_autoresponse_email),
	feature_image_upload_id: v.optional(base.entries.feature_image_upload_id),

	point_person_id: v.optional(base.entries.point_person_id),

	custom_code: v.optional(base.entries.custom_code, DEFAULT_CUSTOM_CODE),
	html_metatags: v.optional(base.entries.html_metatags, DEFAULT_HTML_METATAGS)
});
export type Create = v.InferOutput<typeof create>;

export const update = v.partial(v.omit(create, ['autoresponse_email']));
export type Update = v.InferOutput<typeof update>;

export const petitionSignature = v.object({
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
export type PetitionSignature = v.InferOutput<typeof petitionSignature>;

export const signatureQueueMessage = v.object({
	petition_id: id,
	signup: petitionSignature
});
