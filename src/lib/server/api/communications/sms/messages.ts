import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/communications/sms/messages';
import * as m from '$lib/paraglide/messages';

function redisString(instanceId: number, messageId: number | 'all') {
	return `i:${instanceId}:sms_messages:${messageId}`;
}

export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const result = await db
		.insert('communications.sms_messages', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function read({
	instanceId,
	messageId,
	t
}: {
	instanceId: number;
	messageId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, messageId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.sms_messages', { instance_id: instanceId, id: messageId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:SMS:MESSAGES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, messageId), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url
}: {
	instanceId: number;
	url: URL;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (!query.filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'communications.sms_messages',
			{ instance_id: instanceId, ...query.where },
			query.options
		)
		.run(pool);
	const parsedResult = parse(schema.list, result);
	if (!query.filtered) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	messageId,
	body,
	t
}: {
	instanceId: number;
	messageId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.sms_messages', parsed, { instance_id: instanceId, id: messageId })
		.run(pool);

	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:SMS:MESSAGES:READ:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, messageId), parsedResult);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

//Maybe don't need this actually
/* export async function exists({
	instanceId,
	messageId,
	t
}: {
	instanceId: number;
	messageId: number;
	t: App.Localization;
}): Promise<true> {
	const cached = await redis.get(redisString(instanceId, messageId));
	if (cached) {
		return true;
	}
	const result = await db
		.selectExactlyOne('communications.sms_messages', { instance_id: instanceId, id: messageId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:SMS:MESSAGES:EXISTS:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	return true;
} */
