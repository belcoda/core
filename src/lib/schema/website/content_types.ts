import {
	v,
	id,
	shortString,
	slug,
	timestamp,
	count,
	shortStringNotEmpty
} from '$lib/schema/valibot';

export const base = v.object({
	id: id,
	instance_id: id,
	name: shortStringNotEmpty,
	slug: slug,
	active: v.boolean(),
	created_at: timestamp,
	updated_at: timestamp
});

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	items: v.array(v.omit(base, ['instance_id'])),
	count: count
});
export type List = v.InferOutput<typeof list>;

export const create = v.pick(base, ['name', 'slug']);
export type Create = v.InferOutput<typeof create>;

export const update = v.partial(v.pick(base, ['name', 'slug', 'active']));
export type Update = v.InferOutput<typeof update>;
