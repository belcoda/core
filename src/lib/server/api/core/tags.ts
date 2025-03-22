import { db, redis, pool, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import * as schema from '$lib/schema/core/tags';
function redisString(instanceId: number, tagId: number | 'all') {
	return `i:${instanceId}:tags:${tagId}`;
}
export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const inserted = await db.insert('tags', { instance_id: instanceId, ...parsed }).run(pool);
	await redis.del(redisString(instanceId, 'all'));
	const parsedInserted = parse(schema.read, inserted);
	await redis.set(redisString(instanceId, parsedInserted.id), parsedInserted);
	return parsedInserted;
}

export async function list({
	instanceId,
	url
}: {
	instanceId: number;
	url: URL;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered === false) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const fetched = await db
		.select('tags', { instance_id: instanceId, ...filter.where }, filter.options)
		.run(pool);
	const count = await db.count('tags', { instance_id: instanceId, ...filter.where }).run(pool);
	const parsedFetched = parse(schema.list, { items: fetched, count: count });
	if (filter.filtered === false) await redis.set(redisString(instanceId, 'all'), parsedFetched);
	return parsedFetched;
}

export async function read({
	instanceId,
	tagId,
	t
}: {
	instanceId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, tagId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const fetched = await db
		.selectExactlyOne('tags', { instance_id: instanceId, id: tagId })
		.run(pool);
	if (!fetched) {
		throw new BelcodaError(404, 'DATA:TAGS:READ:01', m.that_tasty_dove_pop());
	}
	const parsedFetched = parse(schema.read, fetched);
	await redis.set(redisString(instanceId, tagId), parsedFetched);
	return parsedFetched;
}

export async function update({
	instanceId,
	tagId,
	body,
	t
}: {
	instanceId: number;
	tagId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db.update('tags', parsed, { instance_id: instanceId, id: tagId }).run(pool);
	if (updated.length !== 1)
		throw new BelcodaError(404, 'DATA:TAGS:UPDATE:01', m.that_tasty_dove_pop());
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, tagId), parsedUpdated);
	return parsedUpdated;
}
