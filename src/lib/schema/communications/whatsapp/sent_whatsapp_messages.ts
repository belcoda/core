import { v, id, timestamp, uuid, count, shortString } from '$lib/schema/valibot';
import { message } from '$lib/schema/communications/whatsapp/elements/message';
export const base = v.object({
	id: uuid,
	person_id: id,
	message_id: uuid,
	conversation_id: v.nullable(id),
	message: message,
	wamid: shortString,
	delivered: v.boolean(),
	read: v.boolean(),
	reacted: v.boolean(),
	stale: v.boolean(),
	reacted_emoji: v.nullable(v.pipe(v.string(), v.length(1), v.emoji())),
	created_at: timestamp,
	updated_at: timestamp
});

export const read = base;
export type Read = v.InferOutput<typeof read>;

export const list = v.object({ items: v.array(read), count: count });
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	id: v.optional(base.entries.id),
	person_id: base.entries.person_id,
	message_id: base.entries.message_id,
	conversation_id: v.optional(base.entries.conversation_id),
	message: base.entries.message,
	wamid: base.entries.wamid,
	delivered: v.optional(base.entries.delivered, false),
	read: v.optional(base.entries.read, false),
	reacted: v.optional(base.entries.reacted, false),
	stale: v.optional(base.entries.stale, false),
	reacted_emoji: v.optional(base.entries.reacted_emoji, null)
});
export type Create = v.InferInput<typeof create>;

export const update = v.partial(
	v.pick(create, ['delivered', 'read', 'reacted', 'stale', 'reacted_emoji', 'wamid'])
);
export type Update = v.InferOutput<typeof update>;
