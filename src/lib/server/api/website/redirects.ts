import { db, pool, redis, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import * as schema from '$lib/schema/website/redirects';

function redisString(instanceId: number, fromUrl: string) {
	return `i:${instanceId}:r:${fromUrl}`;
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
		.insert('website.redirects', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function update({
	instanceId,
	from,
	body
}: {
	instanceId: number;
	from: string;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('website.redirects', { instance_id: instanceId, from }, parsed)
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, from));
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
		.select('website.redirects', { instance_id: instanceId, ...filter.where }, filter.options)
		.run(pool);
	const parsedResult = parse(schema.list, result);
	await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function readByUrl({
	instance_id,
	url,
	t
}: {
	instance_id: number;
	url: string;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instance_id, url));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('website.redirects', { instance_id, from: url })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:WEBSITE:REDIRECTS:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instance_id, url), parsedResult);
	return parsedResult;
}
