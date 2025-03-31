import { db, pool, redis, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/website/blocks';
import * as m from '$lib/paraglide/messages';

function redisString(instanceId: number, blockId: number | 'all') {
	return `i:${instanceId}:blocks:${blockId}`;
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
		.insert('website.blocks', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function read({
	instanceId,
	blockId,
	t
}: {
	instanceId: number;
	blockId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, blockId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('website.blocks', { instance_id: instanceId, id: blockId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:WEBSITE:BLOCKS:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, blockId), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url,
	t
}: {
	instanceId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}

	const result = await db
		.select('website.blocks', { instance_id: instanceId, ...filter.where }, filter.options)
		.run(pool);
	const count = await db
		.count('website.blocks', { instance_id: instanceId, ...filter.where })
		.run(pool);
	const parsedResult = parse(schema.list, { count: count, items: result });
	if (filter.filtered !== true) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function listAllForInstance({
	instanceId
}: {
	instanceId: number;
}): Promise<schema.Read[]> {
	const result = await db.select('website.blocks', { instance_id: instanceId }).run(pool);

	const parsedResult = result.map((r) => parse(schema.read, r));
	return parsedResult;
}

export async function update({
	instanceId,
	blockId,
	body,
	t
}: {
	instanceId: number;
	blockId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('website.blocks', parsed, { instance_id: instanceId, id: blockId })
		.run(pool);
	if (result.length !== 1)
		throw new BelcodaError(404, 'DATA:WEBSITE:BLOCKS:UPDATE:01', m.pretty_tired_fly_lead());
	const parsedResult = parse(schema.read, result[0]);
	await redis.del(redisString(instanceId, blockId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}
