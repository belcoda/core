import { v, id, shortString, timestamp, slug, longString } from '$lib/schema/valibot';

import {
	validation,
	type Validation,
	type ValidationArray,
	validationArray
} from '$lib/schema/people/custom_fields/validation';

export { validation, type ValidationArray, type Validation, validationArray };

export const base = v.object({
	id: id,
	instance_id: id,
	slug: slug,
	name: shortString,
	label: shortString,
	description: v.nullable(longString),
	type: v.literal('text'),
	validation: validationArray,
	created_at: timestamp,
	updated_at: timestamp
});

export const create = v.object({
	slug: base.entries.slug,
	name: base.entries.name,
	label: base.entries.label,
	description: v.optional(base.entries.description),
	type: v.optional(base.entries.type, 'text'),
	validation: v.optional(base.entries.validation, [])
});
export type Create = v.InferOutput<typeof create>;

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const list = v.array(v.omit(base, ['instance_id', 'description', 'validation']));
export type List = v.InferOutput<typeof list>;

export const update = v.partial(v.pick(base, ['name', 'label', 'type', 'validation']));
export type Update = v.InferOutput<typeof update>;

export const readFromPerson = v.object({
	field: v.object({
		name: longString,
		slug: slug,
		type: v.literal('text')
	}),
	value: longString
});
export type ReadFromPerson = v.InferOutput<typeof readFromPerson>;
