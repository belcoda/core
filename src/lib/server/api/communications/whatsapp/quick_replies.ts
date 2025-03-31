import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/quick_replies';

export async function create({
	threadId,
	body
}: {
	threadId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const result = await db
		.insert('communications.whatsapp_quick_replies', { thread_id: threadId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function read({
	threadId,
	replyId,
	t
}: {
	threadId: number;
	replyId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const result = await db
		.selectExactlyOne('communications.whatsapp_quick_replies', { thread_id: threadId, id: replyId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:QUICK_REPLIES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function list({
	threadId,
	url
}: {
	threadId: number;
	url: URL;
}): Promise<schema.List> {
	const { options } = filterQuery(url);
	const result = await db
		.select(
			'communications.whatsapp_quick_replies',
			{ thread_id: threadId },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_quick_replies', { thread_id: threadId })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	return parsedResult;
}

export async function remove({
	threadId,
	replyId
}: {
	threadId: number;
	replyId: number;
}): Promise<void> {
	const result = await db
		.deletes('communications.whatsapp_quick_replies', { thread_id: threadId, id: replyId })
		.run(pool);
	return;
}
