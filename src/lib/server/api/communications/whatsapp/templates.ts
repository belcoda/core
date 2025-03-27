import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import * as schema from '$lib/schema/communications/whatsapp/template';

function redisString(instanceId: number, templateId: number | 'all') {
	return `i:${instanceId}:whatsapp_templates:${templateId}`;
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
		.insert('communications.whatsapp_templates', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	return parsedResult;
}

export async function read({
	instanceId,
	templateId,
	t
}: {
	instanceId: number;
	templateId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, templateId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.whatsapp_templates', {
			instance_id: instanceId,
			id: templateId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:TEMPLATES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, templateId), parsedResult);
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
		.select('communications.whatsapp_templates', { instance_id: instanceId, ...where }, options)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_templates', { instance_id: instanceId, ...where })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	templateId,
	body,
	t
}: {
	instanceId: number;
	templateId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.whatsapp_templates', parsed, {
			instance_id: instanceId,
			id: templateId
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:TEMPLATES:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	return parsedResult;
}
