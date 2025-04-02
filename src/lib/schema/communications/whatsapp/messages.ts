import { v, id, mediumString, timestamp, uuid, count, shortString } from '$lib/schema/valibot';
import { actions, keyword_triggers } from '$lib/schema/communications/actions/actions';
import { message } from '$lib/schema/communications/whatsapp/elements/message';
export const base = v.object({
	id: uuid,
	thread_id: v.nullable(id),
	instance_id: id,
	wamid: v.nullable(shortString),
	actions: actions,
	keywords: keyword_triggers,
	message: message,
	on_sent_action: v.nullable(uuid),
	on_read_action: v.nullable(uuid),
	next: v.nullable(uuid),
	created_at: timestamp,
	updated_at: timestamp,
	deleted_at: v.nullable(timestamp)
});

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	items: v.array(read),
	count: count
});
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	wamid: v.optional(base.entries.wamid, null),
	thread_id: v.optional(base.entries.thread_id, null),
	actions: v.optional(base.entries.actions, {}),
	keywords: v.optional(base.entries.keywords, {}),
	message: base.entries.message,
	on_sent_action: v.optional(base.entries.on_sent_action, null),
	on_read_action: v.optional(base.entries.on_read_action, null),
	next: v.optional(base.entries.next, null)
});
export type Create = v.InferInput<typeof create>;

export const update = v.partial(create);
export type Update = v.InferOutput<typeof update>;
