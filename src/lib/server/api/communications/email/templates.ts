import { db, pool, redis, filterQuery, BelcodaError, pino } from '$lib/server';
import * as schema from '$lib/schema/communications/email/templates';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

function redisString(instanceId: number, templateId: number | 'all') {
	return `i:${instanceId}:email_templates:${templateId}`;
}

export async function create({
	instanceId,
	body,
	t
}: {
	instanceId: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const inserted = await db
		.insert('communications.email_templates', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedInserted.id), parsedInserted);
	return parsedInserted;
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
	const selected = await db
		.selectExactlyOne('communications.email_templates', { id: templateId, instance_id: instanceId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:EMAIL:TEMPLATES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	await redis.set(redisString(instanceId, templateId), selected);
	return parse(schema.read, selected);
}

export async function list({
	instanceId,
	t,
	url
}: {
	instanceId: number;
	t: App.Localization;
	url: URL;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const selected = await db
		.select(
			'communications.email_templates',
			{ instance_id: instanceId, ...query.where },
			query.options
		)
		.run(pool);
	const count = await db
		.count('communications.email_templates', { instance_id: instanceId, ...query.where })
		.run(pool);
	const parsedSelected = parse(schema.list, { count: count, items: selected });
	if (!query.filtered) await redis.set(redisString(instanceId, 'all'), parsedSelected);
	return parsedSelected;
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
	const updated = await db
		.update('communications.email_templates', parsed, { id: templateId, instance_id: instanceId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:TEMPLATES:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedUpdated.id), parsedUpdated);
	return parsedUpdated;
}
