import { v, id, timestamp, count } from '$lib/schema/valibot';
import { read as person } from '$lib/schema/people/people';

export const base = v.object({
	petition_id: id,
	send_autoresponse: v.boolean(),
	person_id: id,
	created_at: timestamp
});

export const viewBase = v.object({
	...base.entries,
	full_name: person.entries.full_name,
	given_name: person.entries.given_name,
	family_name: person.entries.family_name,
	email: person.entries.email,
	phone_number: person.entries.phone_number,
	address_line_1: person.entries.address_line_1,
	address_line_2: person.entries.address_line_2,
	locality: person.entries.locality,
	state: person.entries.state,
	postcode: person.entries.postcode,
	country: person.entries.country
});
export type ViewBase = v.InferOutput<typeof viewBase>;

export const read = viewBase;
export type Read = v.InferOutput<typeof read>;

export const list = v.object({ items: v.array(read), count: count });
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	...v.omit(base, ['created_at', 'petition_id']).entries,
	send_autoresponse: v.optional(v.boolean(), true),
	response_channel: v.optional(v.union([v.literal('email'), v.literal('whatsapp')]), 'email')
});
export type Create = v.InferOutput<typeof create>;
