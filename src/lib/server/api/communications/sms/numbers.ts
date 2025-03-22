import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/communications/sms/numbers';
import * as m from '$lib/paraglide/messages';
function redisString(instanceId: number, numberId: number | 'all') {
	return `i:${instanceId}:sms_numbers:${numberId}`;
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
		.insert('communications.sms_numbers', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	return parsedResult;
}

export async function read({
	instanceId,
	numberId,
	t
}: {
	instanceId: number;
	numberId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, numberId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.sms_numbers', { instance_id: instanceId, id: numberId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:SMS:NUMBERS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, numberId), parsedResult);
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
			'communications.sms_numbers',
			{ instance_id: instanceId },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const parsedResult = parse(schema.list, result);
	if (!filtered) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	numberId,
	body,
	t
}: {
	instanceId: number;
	numberId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.sms_numbers', { instance_id: instanceId, id: numberId }, parsed)
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:SMS:NUMBERS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	return parsedResult;
}
