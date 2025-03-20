import { BelcodaError, db, pool, redis } from '$lib/server';
import * as schema from '$lib/schema/people/taggings';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import { exists, redisString } from '$lib/server/api/people/people';

export async function create({
	instanceId,
	personId,
	tagId,
	t
}: {
	instanceId: number;
	personId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	await exists({ instanceId: instanceId, personId, t });
	const inserted = await db
		.insert('people.taggings', { person_id: personId, tag_id: tagId })
		.run(pool)
		.catch(async (err) => {
			if (err.code !== '23505') {
				throw new BelcodaError(
					500,
					'DATA:PEOPLE:TAGGINGS:CREATE:01',
					m.spry_ago_baboon_cure(),
					err
				);
			} else {
				return await _unsafeRead({ tagId, personId, t });
			}
		});
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, personId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedInserted;
}

export async function _unsafeRead({
	tagId,
	personId,
	t
}: {
	personId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const fetched = await db
		.selectExactlyOne('people.taggings', { person_id: personId, tag_id: tagId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:TAGGINGS:READ:01', m.that_tasty_dove_pop(), err);
		});
	return parse(schema.read, fetched);
}

export async function list({
	instanceId,
	personId,
	t
}: {
	instanceId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.List> {
	await exists({ instanceId: instanceId, personId, t });
	const fetched = await db
		.select(
			'people.taggings',
			{ person_id: personId },
			{ lateral: { tag: db.selectExactlyOne('tags', { id: db.parent('tag_id') }) } }
		)
		.run(pool);
	const parsed = parse(
		schema.list,
		fetched.map((row) => row.tag)
	);
	return parsed;
}

export async function del({
	instanceId,
	personId,
	tagId,
	t
}: {
	instanceId: number;
	personId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Del> {
	await exists({ instanceId: instanceId, personId, t });
	await db.deletes('people.taggings', { person_id: personId, tag_id: tagId }).run(pool);
	const parsed = parse(schema.del, { success: true });
	await redis.del(redisString(instanceId, personId));
	await redis.del(redisString(instanceId, 'all'));
	return parsed;
}
