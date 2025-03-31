import { db, pool, redis, error, BelcodaError, pino, filterQuery } from '$lib/server';
//import * as schema from '$lib/schema/people/custom_fields';
import { redisString } from '$lib/server/api/people/people';
const log = pino(import.meta.url);

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/people/custom_fields';
import { parse } from '$lib/schema/valibot';
export async function read({
	instance_id,
	custom_field_name,
	t
}: {
	instance_id: number;
	custom_field_name: string;
	t: App.Localization;
}) {
	const customField = await db
		.selectExactlyOne('people.custom_fields', { instance_id, name: custom_field_name })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:CUSTOM_FIELDS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsed = parse(schema.read, customField);
	return parsed;
}

export async function create({
	instance_id,
	body,
	t
}: {
	instance_id: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	log.info('created');
	const parsed = parse(schema.create, body);
	const toCreate = {
		instance_id,
		...parsed
	};
	const created = await db
		.insert('people.custom_fields', toCreate)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				500,
				'DATA:PEOPLE:CUSTOM_FIELDS:CREATE:01',
				m.cute_large_toucan_arise(),
				err
			);
		});
	const createdParsed = parse(schema.read, created);
	await redis.del(redisString(instance_id, 'all'));
	return createdParsed;
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
	const query = filterQuery(url);
	const selected = await db
		.select('people.custom_fields', { instance_id: instanceId, ...query.where }, query.options)
		.run(pool);
	const parsed = parse(schema.list, selected);
	return parsed;
}

export async function update({
	instanceId,
	body,
	customFieldName,
	t
}: {
	instanceId: number;
	body: schema.Update;
	customFieldName: schema.Update['name'];
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('people.custom_fields', parsed, { instance_id: instanceId, name: customFieldName })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				500,
				'DATA:PEOPLE:CUSTOM_FIELDS:UPDATE:01',
				m.heroic_stout_buzzard_believe(),
				err
			);
		});
	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:CUSTOM_FIELDS:UPDATE:02', m.that_tasty_dove_pop());
	}
	const updatedParsed = parse(schema.read, updated[0]);
	return updatedParsed;
}
