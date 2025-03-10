import { v, id, timestamp, longString, count } from '$lib/schema/valibot';
import { read as person } from '$lib/schema/people/people';
export const attendeeStatus = v.picklist(['registered', 'attended', 'cancelled', 'noshow']);
export type AttendeeStatus = v.InferOutput<typeof attendeeStatus>;
export const base = v.object({
	event_id: id,
	person_id: id,
	status: attendeeStatus,
	notes: v.nullable(longString),
	created_at: timestamp,
	updated_at: timestamp,
	send_notifications: v.boolean()
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

export const list = v.object({ count: count, items: v.array(viewBase) });
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	person_id: base.entries.person_id,
	status: v.optional(base.entries.status, 'registered'),
	notes: v.optional(base.entries.notes),
	send_notifications: v.optional(base.entries.send_notifications, true),
	response_channel: v.optional(v.union([v.literal('email'), v.literal('whatsapp')]), 'email')
});
export type Create = v.InferOutput<typeof create>;

export const update = v.partial(v.omit(base, ['event_id', 'person_id']));
export type Update = v.InferOutput<typeof update>;
