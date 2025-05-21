import {
	v,
	id,
	timestamp,
	count,
	email,
	domainName,
	shortStringNotEmpty
} from '$lib/schema/valibot';

export const base = v.object({
	id: id,
	instance_id: id,
	name: shortStringNotEmpty,
	email: email,
	external_id: v.nullable(shortStringNotEmpty),
	verified: v.boolean(),
	return_path_domain: v.nullable(domainName),
	return_path_domain_verified: v.boolean(),
	created_at: timestamp,
	updated_at: timestamp,
	deleted_at: v.nullable(timestamp)
});
export type Base = v.InferOutput<typeof base>;

export const read = v.omit(base, ['instance_id', 'deleted_at']);
export type Read = v.InferOutput<typeof read>;

export const list = v.object({ items: v.array(read), count: count });
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	name: base.entries.name,
	email: base.entries.email,
	return_path_domain: v.optional(base.entries.return_path_domain)
});
export type Create = v.InferInput<typeof create>;

export const update = v.object({
	name: v.optional(base.entries.name),
	return_path_domain: v.optional(base.entries.return_path_domain)
});
export type Update = v.InferInput<typeof update>;
