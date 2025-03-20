import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/communications/sms/sends';

import * as m from '$lib/paraglide/messages';

function redisString(instanceId: number, messageId: number, sendId: number | 'all') {
	return `i:${instanceId}:sms_messages:${messageId}:sends:${sendId}`;
}

export async function create({
	instanceId,
	messageId,
	adminId,
	body
}: {
	instanceId: number;
	messageId: number;
	adminId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const toInsert = {
		sent_by_id: adminId,
		message_id: messageId,
		...parsed
	};
	const inserted = await db.insert('communications.sms_sends', toInsert).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, messageId, 'all'));
	await redis.set(redisString(instanceId, messageId, parsedInserted.id), parsedInserted);
	return parsedInserted;
}

export async function read({
	instanceId,
	messageId,
	sendId,
	t
}: {
	instanceId: number;
	messageId: number;
	sendId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, messageId, sendId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const selected = await db
		.selectExactlyOne('communications.sms_sends', { id: sendId, message_id: messageId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:SMS:SENDS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	await redis.set(redisString(instanceId, messageId, sendId), selected);
	return parse(schema.read, selected);
}

export async function listForMessage({
	instanceId,
	messageId,
	t,
	url
}: {
	instanceId: number;
	messageId: number;
	t: App.Localization;
	url: URL;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, messageId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const selected = await db
		.select(
			'communications.sms_sends',
			{ message_id: messageId },
			{
				limit: query.options.limit,
				offset: query.options.offset,
				order: {
					by: 'started_at',
					direction: 'DESC'
				}
			}
		)
		.run(pool);
	const parsedSelected = parse(schema.list, selected);
	if (!query.filtered) await redis.set(redisString(instanceId, messageId, 'all'), parsedSelected);
	return parsedSelected;
}
