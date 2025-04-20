import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/whatsapp/sends';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import { exists, read as readThread } from '$lib/server/api/communications/whatsapp/threads';
function redisString(instanceId: number, threadId: number, sendId: number | 'all') {
	return `i:${instanceId}:whatsapp_threads:${threadId}:sends:${sendId}`;
}

export async function create({
	instanceId,
	threadId,
	adminId,
	queue,
	body,
	t
}: {
	instanceId: number;
	threadId: number;
	queue: App.Queue;
	adminId: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const toInsert = {
		sent_by_id: adminId,
		thread_id: threadId,
		list_id: parsed.list_id
	};
	const inserted = await db.insert('communications.whatsapp_sends', toInsert).run(pool);
	await redis.del(redisString(instanceId, threadId, 'all'));
	const parsedInserted = await read({ instanceId, threadId, sendId: inserted.id, t: t });
	await redis.set(redisString(instanceId, threadId, parsedInserted.id), parsedInserted);
	await queue('/whatsapp/send_thread', instanceId, parsedInserted, adminId);
	return parsedInserted;
}

export async function read({
	instanceId,
	threadId,
	sendId,
	t
}: {
	instanceId: number;
	threadId: number;
	sendId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, threadId, sendId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const thread = await readThread({ instanceId, threadId });
	const selected = await db
		.selectExactlyOne(
			'communications.whatsapp_sends',
			{ id: sendId, thread_id: threadId },
			{
				lateral: {
					list: db.selectExactlyOne('people.lists', {
						id: db.parent('list_id'),
						deleted_at: db.conditions.isNull
					}),
					delivered: db.count('communications.sent_whatsapp_messages', {
						message_id: thread.template_message_id,
						delivered: true
					}),
					read: db.count('communications.sent_whatsapp_messages', {
						message_id: thread.template_message_id,
						read: true
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:SENDS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	await redis.set(redisString(instanceId, threadId, sendId), selected);
	return parse(schema.read, selected);
}

export async function update({
	instanceId,
	threadId,
	sendId,
	body,
	t
}: {
	instanceId: number;
	threadId: number;
	sendId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	await exists({ instanceId, threadId });
	const updated = await db
		.update('communications.whatsapp_sends', parsed, { id: sendId, thread_id: threadId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:SENDS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, threadId, 'all'));
	await redis.del(redisString(instanceId, threadId, sendId));
	const retrieved = await read({ instanceId, threadId, sendId, t });
	return retrieved;
}

export async function listForThread({
	instanceId,
	threadId,
	t,
	url
}: {
	instanceId: number;
	threadId: number;
	t: App.Localization;
	url: URL;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, threadId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const thread = await readThread({ instanceId, threadId });
	const selected = await db
		.select(
			'communications.whatsapp_sends',
			{ thread_id: threadId },
			{
				limit: query.options.limit,
				offset: query.options.offset,
				lateral: {
					list: db.selectExactlyOne('people.lists', {
						id: db.parent('list_id'),
						deleted_at: db.conditions.isNull
					}),
					delivered: db.count('communications.sent_whatsapp_messages', {
						message_id: thread.template_message_id,
						delivered: true
					}),
					read: db.count('communications.sent_whatsapp_messages', {
						message_id: thread.template_message_id,
						read: true
					})
				},
				order: {
					by: 'started_at',
					direction: 'DESC'
				}
			}
		)
		.run(pool);
	const count = await db.count('communications.whatsapp_sends', { thread_id: threadId }).run(pool);
	const parsedSelected = parse(schema.list, { items: selected, count: count });
	if (!query.filtered) await redis.set(redisString(instanceId, threadId, 'all'), parsedSelected);
	return parsedSelected;
}
