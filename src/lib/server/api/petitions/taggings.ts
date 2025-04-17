import { BelcodaError, db, pool, redis } from '$lib/server';
import * as schema from '$lib/schema/petitions/taggings';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import { exists, redisString } from '$lib/server/api/petitions/petitions';

export async function create({
	instanceId,
	petitionId,
	tagId,
	t
}: {
	instanceId: number;
	petitionId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	await exists({ instanceId: instanceId, petitionId });
	const inserted = await db
		.insert('petitions.taggings', { petition_id: petitionId, tag_id: tagId })
		.run(pool)
		.catch(async (err) => {
			if (err.code !== '23505') {
				throw new BelcodaError(
					500,
					'DATA:PETITIONS:TAGGINGS:CREATE:01',
					m.spry_ago_baboon_cure(),
					err
				);
			} else {
				return await _unsafeRead({ tagId, petitionId, t });
			}
		});
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, petitionId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedInserted;
}

export async function _unsafeRead({
	tagId,
	petitionId,
	t
}: {
	petitionId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const fetched = await db
		.selectExactlyOne('petitions.taggings', { petition_id: petitionId, tag_id: tagId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PETITIONS:TAGGINGS:READ:01', m.that_tasty_dove_pop(), err);
		});
	return parse(schema.read, fetched);
}

export async function list({
	instanceId,
	petitionId,
	t
}: {
	instanceId: number;
	petitionId: number;
	t: App.Localization;
}): Promise<schema.List> {
	await exists({ instanceId: instanceId, petitionId });
	const fetched = await db
		.select(
			'petitions.taggings',
			{ petition_id: petitionId },
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
	petitionId,
	tagId,
	t
}: {
	instanceId: number;
	petitionId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Del> {
	await exists({ instanceId: instanceId, petitionId });
	await db.deletes('petitions.taggings', { petition_id: petitionId, tag_id: tagId }).run(pool);
	const parsed = parse(schema.del, { success: true });
	await redis.del(redisString(instanceId, petitionId));
	await redis.del(redisString(instanceId, 'all'));
	return parsed;
}
