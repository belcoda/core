import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/sms/threads';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

function redisString(instanceId: number, threadId: number | 'all') {
	return `i:${instanceId}:received_sms:${threadId}`;
}

export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const toInsert = {
		instance_id: instanceId,
		...parsed
	};
	const inserted = await db.insert('communications.sms_threads', toInsert).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedInserted.id), parsedInserted);
	return parsedInserted;
}

export async function update({
	instanceId,
	threadId,
	body,
	t
}: {
	instanceId: number;
	threadId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const toUpdate = {
		instance_id: instanceId,
		...parsed
	};
	const updated = await db
		.update('communications.sms_threads', toUpdate, { instance_id: instanceId, id: threadId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:SMS:THREADS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedUpdated.id), parsedUpdated);
	return parsedUpdated;
}

export async function read({
	instanceId,
	threadId,
	t
}: {
	instanceId: number;
	threadId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, threadId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.sms_threads', { instance_id: instanceId, id: threadId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:SMS:THREADS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, threadId), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url
}: {
	instanceId: number;
	url: URL;
}): Promise<schema.List> {
	const { filtered, where, options } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'communications.sms_threads',
			{ instance_id: instanceId, ...where },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const parsedResult = parse(schema.list, result);
	if (!filtered) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}
