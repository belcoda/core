import * as schema from '$lib/schema/people/lists';
import { parse } from '$lib/schema/valibot';
import { exists as personExists } from '$lib/server/api/people/people';
import { db, pool, BelcodaError, redis, filterQuery } from '$lib/server';
import * as m from '$lib/paraglide/messages';
function redisString(instanceId: number, listId: number | 'all') {
	return `i:${instanceId}:lists:${listId}`;
}

export async function exists({
	instanceId,
	listId,
	t
}: {
	instanceId: number;
	listId: number;
	t: App.Localization;
}): Promise<true> {
	const cached = await redis.get(redisString(instanceId, listId));
	if (cached) {
		return true;
	}
	const fetched = await db
		.selectExactlyOne('people.list_view', { instance_id: instanceId, id: listId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:LISTS:READ:01', m.ago_bad_lemur_commend(), err);
		});
	return true; //will have already errored if not exactlyOne found
}

export async function read({
	instanceId,
	listId,
	t
}: {
	instanceId: number;
	listId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, listId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const fetched = await db
		.selectExactlyOne('people.list_view', { instance_id: instanceId, id: listId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:LISTS:READ:01', m.that_tasty_dove_pop(), err);
		});
	const parsedFetched = parse(schema.read, fetched);
	await redis.set(redisString(instanceId, listId), parsedFetched);
	return parsedFetched;
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
		.insert('people.lists', { instance_id: instanceId, ...parsed })
		.run(pool);
	const readInserted = await read({ instanceId, listId: inserted.id, t });
	await redis.set(redisString(instanceId, readInserted.id), readInserted);
	await redis.del(redisString(instanceId, 'all'));
	return readInserted;
}

export async function update({
	instanceId,
	listId,
	body,
	t
}: {
	instanceId: number;
	listId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('people.lists', { ...parsed }, { instance_id: instanceId, id: listId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:LISTS:UPDATE:01', m.that_tasty_dove_pop());
	}
	await redis.del(redisString(instanceId, listId));
	await redis.del(redisString(instanceId, 'all'));
	const readUpdated = await read({ instanceId, listId, t });
	return readUpdated;
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
		.select('people.list_view', { instance_id: instanceId, ...filter.where }, filter.options)
		.run(pool);
	const count = await db
		.count('people.list_view', { instance_id: instanceId, ...filter.where })
		.run(pool);
	const parsedFetched = parse(schema.list, { items: fetched, count: count });
	if (filter.filtered === false) await redis.set(redisString(instanceId, 'all'), parsedFetched);
	return parsedFetched;
}

//idempotent
export async function addPersonToList({
	instanceId,
	listId,
	personId,
	t
}: {
	instanceId: number;
	listId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.AddPersonToList> {
	await personExists({ instanceId, personId });
	await exists({ instanceId, listId, t });
	const inserted = await db
		.insert('people.list_people', { list_id: listId, person_id: personId })
		.run(pool)
		.catch(async (err) => {
			if (err.code === '23505') {
				//unique_violation error (they already exist)
				const result = await db
					.selectExactlyOne('people.list_people', { list_id: listId, person_id: personId })
					.run(pool);
				return parse(schema.addPersonToList, result);
			}
		});
	const parsedInserted = parse(schema.addPersonToList, inserted);
	await redis.del(redisString(instanceId, listId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedInserted;
}

//idempotent
export async function removePersonFromList({
	instanceId,
	listId,
	personId,
	t
}: {
	instanceId: number;
	listId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.RemovePersonFromList> {
	await exists({ instanceId, listId, t });
	await personExists({ instanceId, personId });
	await db.deletes('people.list_people', { list_id: listId, person_id: personId }).run(pool);
	await redis.del(redisString(instanceId, listId));
	await redis.del(redisString(instanceId, 'all'));
	const parsed = parse(schema.removePersonFromList, { success: true });
	return parsed;
}

export async function getAllPersonIds({
	instanceId,
	listId,
	t
}: {
	instanceId: number;
	listId: number;
	t: App.Localization;
}): Promise<number[]> {
	await exists({ instanceId, listId, t });
	const result = await db
		.select('people.list_people', { list_id: listId }, { columns: ['person_id'] })
		.run(pool);

	const ids = result.map((item) => item.person_id);
	return ids;
}

export async function del({
	instanceId,
	listId
}: {
	instanceId: number;
	listId: number;
}): Promise<void> {
	if (!(await exists({ instanceId, listId }))) {
		throw new BelcodaError(404, 'DATA:PEOPLE:LISTS:DEL:01', m.pretty_tired_fly_lead());
	}
	await db
		.update('people.lists', { deleted_at: new Date() }, { instance_id: instanceId, id: listId })
		.run(pool);
	await redis.del(redisString(instanceId, listId));
	await redis.del(redisString(instanceId, 'all'));
}
