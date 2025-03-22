import * as schema from '$lib/schema/people/imports';
import { parse } from '$lib/schema/valibot';
import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as m from '$lib/paraglide/messages';

export function redisString(instanceId: number) {
	return `i:${instanceId}:people:imports:all`;
}

export async function create({
	instanceId,
	csvUrl,
	queue,
	adminId
}: {
	instanceId: number;
	csvUrl: string;
	queue: App.Queue;
	adminId: number;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, { csv_url: csvUrl });
	const result = await db
		.insert('people.imports', {
			instance_id: instanceId,
			csv_url: parsed.csv_url,
			status: parsed.status
		})
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId));
	await queue(`/imports/people/${parsedResult.id}`, instanceId, {}, adminId);
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
		const cached = await redis.get(redisString(instanceId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const results = await db
		.select(
			'people.imports',
			{ instance_id: instanceId },
			{
				offset: options.offset,
				limit: options.limit,
				order: { by: 'created_at', direction: 'DESC' }
			}
		)
		.run(pool);
	const count = await db.count('people.imports', { instance_id: instanceId }).run(pool);
	const parsedResults = parse(schema.list, { items: results, count: count });
	if (!filtered) await redis.set(redisString(instanceId), parsedResults);
	return parsedResults;
}

export async function read({
	instanceId,
	importId
}: {
	instanceId: number;
	importId: number;
}): Promise<schema.Read> {
	const result = await db
		.selectExactlyOne('people.imports', { instance_id: instanceId, id: importId })
		.run(pool);
	return parse(schema.read, result);
}

export async function update({
	instanceId,
	importId,
	body,
	t
}: {
	instanceId: number;
	importId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const toUpdate = parsed.status === 'complete' ? { completed_at: new Date(), ...parsed } : parsed;
	const result = await db
		.update('people.imports', toUpdate, { instance_id: instanceId, id: importId })
		.run(pool);
	if (result.length !== 1)
		throw new BelcodaError(400, 'DATA:people/import:UPDATE:01', m.pretty_tired_fly_lead());
	await redis.del(redisString(instanceId));
	return parse(schema.read, result[0]);
}
