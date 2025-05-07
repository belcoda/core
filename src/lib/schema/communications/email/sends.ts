import { v, id, timestamp, count, shortStringNotEmpty } from '$lib/schema/valibot';

export const base = v.object({
	id: id,
	instance_id: id,
	name: shortStringNotEmpty,
	message_id: id,
	list_id: v.nullable(id),
	created_at: timestamp,
	updated_at: timestamp,
	sent_by_id: v.nullable(id),
	started_at: v.nullable(timestamp),
	completed_at: v.nullable(timestamp)
});

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const list = v.object({ items: v.array(read), count: count });
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	name: base.entries.name,
	list_id: v.optional(base.entries.list_id),
	message_id: base.entries.message_id
});

export const update = v.object({
	list_id: v.optional(base.entries.list_id),
	name: v.optional(base.entries.name)
});

export const sendToList = v.object({
	list_id: base.entries.list_id
});
export type Update = v.InferOutput<typeof update>;

export type Create = v.InferOutput<typeof create>;
