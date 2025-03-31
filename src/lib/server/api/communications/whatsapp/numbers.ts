import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/numbers';

function redisString(instanceId: number, number: string | 'all') {
	return `i:${instanceId}:whatsapp_numbers:${number}`;
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
		.insert('communications.whatsapp_numbers', { instance_id: instanceId, ...parsed })
		.run(pool);

	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function read({
	instanceId,
	number,
	t
}: {
	instanceId: number;
	number: string;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, number));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.whatsapp_numbers', {
			instance_id: instanceId,
			number: number
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:NUMBERS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, number), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url
}: {
	instanceId: number;
	url: URL;
}): Promise<schema.List> {
	const { filtered, options } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'communications.whatsapp_numbers',
			{ instance_id: instanceId },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_numbers', { instance_id: instanceId })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	number,
	body,
	t
}: {
	instanceId: number;
	number: string;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.whatsapp_numbers', parsed, { instance_id: instanceId, number: number })
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:NUMBERS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, number));
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}
