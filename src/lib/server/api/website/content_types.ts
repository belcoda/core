import { db, pool, redis, BelcodaError, filterQuery } from '$lib/server';
import { parse, id } from '$lib/schema/valibot';
import * as schema from '$lib/schema/website/content_types';
import * as m from '$lib/paraglide/messages';

function redisString(instanceId: number, blockId: number | 'all') {
	return `i:${instanceId}:content_types:${blockId}`;
}

function redisStringSlug(instanceId: number, slug: string) {
	return `i:${instanceId}:ctslug:${slug}`;
}

export async function exists({
	instanceId,
	contentTypeId
}: {
	instanceId: number;
	contentTypeId: number;
}): Promise<boolean> {
	const cached = await redis.get(redisString(instanceId, contentTypeId));
	if (cached) {
		return true;
	}
	const result = await db
		.selectExactlyOne('website.content_types', { instance_id: instanceId, id: contentTypeId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:WEBSITE:CONTENT_TYPES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});

	return true;
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
		.insert('website.content_types', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function update({
	instanceId,
	contentTypeId,
	body
}: {
	instanceId: number;
	contentTypeId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('website.content_types', { instance_id: instanceId, id: contentTypeId }, parsed)
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, contentTypeId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function read({
	instanceId,
	contentTypeId
}: {
	instanceId: number;
	contentTypeId: number;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, contentTypeId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('website.content_types', { instance_id: instanceId, id: contentTypeId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:WEBSITE:CONTENT_TYPES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, contentTypeId), parsedResult);
	return parsedResult;
}

export async function readBySlug({
	instanceId,
	slug,
	t
}: {
	instanceId: number;
	slug: string;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisStringSlug(instanceId, slug));
	if (cached) {
		const cachedId = parse(id, cached);
		return read({ instanceId, contentTypeId: cachedId });
	}
	const result = await db
		.selectExactlyOne(
			'website.content_types',
			{ instance_id: instanceId, slug },
			{ columns: ['id'] }
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:WEBSITE:CONTENT_TYPES:READBYSLUG:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedId = parse(id, result.id);
	await redis.set(redisStringSlug(instanceId, slug), parsedId);
	return await read({ instanceId, contentTypeId: parsedId });
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
		.select('website.content_types', { instance_id: instanceId, ...filter.where }, filter.options)
		.run(pool);
	const count = await db
		.count('website.content_types', { instance_id: instanceId, ...filter.where })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (filter.filtered !== true) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}
