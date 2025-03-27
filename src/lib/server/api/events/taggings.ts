import { BelcodaError, db, pool, redis } from '$lib/server';
import * as schema from '$lib/schema/events/taggings';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import { exists, redisString } from '$lib/server/api/events/events';

export async function create({
	instanceId,
	eventId,
	tagId,
	t
}: {
	instanceId: number;
	eventId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	await exists({ instanceId: instanceId, eventId, t });
	const inserted = await db
		.insert('events.taggings', { event_id: eventId, tag_id: tagId })
		.run(pool)
		.catch(async (err) => {
			if (err.code !== '23505') {
				throw new BelcodaError(
					500,
					'DATA:EVENTS:TAGGINGS:CREATE:01',
					m.spry_ago_baboon_cure(),
					err
				);
			} else {
				return await _unsafeRead({ tagId, eventId, t });
			}
		});
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
	return parsedInserted;
}

export async function _unsafeRead({
	tagId,
	eventId,
	t
}: {
	eventId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const fetched = await db
		.selectExactlyOne('events.taggings', { event_id: eventId, tag_id: tagId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:TAGGINGS:READ:01', m.that_tasty_dove_pop(), err);
		});
	return parse(schema.read, fetched);
}

export async function list({
	instanceId,
	eventId,
	t
}: {
	instanceId: number;
	eventId: number;
	t: App.Localization;
}): Promise<schema.List> {
	await exists({ instanceId: instanceId, eventId, t });
	const fetched = await db
		.select(
			'events.taggings',
			{ event_id: eventId },
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
	eventId,
	tagId,
	t
}: {
	instanceId: number;
	eventId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Del> {
	await exists({ instanceId: instanceId, eventId, t });
	await db.deletes('events.taggings', { event_id: eventId, tag_id: tagId }).run(pool);
	const parsed = parse(schema.del, { success: true });
	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
	return parsed;
}
