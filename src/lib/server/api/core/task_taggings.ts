import { BelcodaError, db, pool, redis } from '$lib/server';
import * as schema from '$lib/schema/core/task_tagging';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import { exists, redisString } from '$lib/server/api/core/tasks';

export async function create({
	instanceId,
	taskId,
	tagId,
	adminId,
	t
}: {
	instanceId: number;
	taskId: number;
	tagId: number;
	adminId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	await exists({ instanceId: instanceId, taskId, t });
	const inserted = await db
		.insert('task_taggings', { task_id: taskId, tag_id: tagId })
		.run(pool)
		.catch(async (err) => {
			if (err.code !== '23505') {
				throw new BelcodaError(500, 'DATA:TASKS:TAGGINGS:CREATE:01', m.spry_ago_baboon_cure(), err);
			} else {
				return await _unsafeRead({ tagId, taskId, t });
			}
		});
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, adminId, false));
	return parsedInserted;
}

export async function _unsafeRead({
	tagId,
	taskId,
	t
}: {
	taskId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const fetched = await db
		.selectExactlyOne('task_taggings', { task_id: taskId, tag_id: tagId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:TASKS:TAGGINGS:UNSAFEREAD:01',
				m.that_tasty_dove_pop(),
				err
			);
		});
	return parse(schema.read, fetched);
}

export async function list({
	instanceId,
	taskId,
	t
}: {
	instanceId: number;
	taskId: number;
	t: App.Localization;
}): Promise<schema.List> {
	await exists({ instanceId: instanceId, taskId, t });
	const fetched = await db
		.select(
			'task_taggings',
			{ task_id: taskId },
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
	taskId,
	adminId,
	tagId,
	t
}: {
	instanceId: number;
	taskId: number;
	adminId: number;
	tagId: number;
	t: App.Localization;
}): Promise<schema.Del> {
	await exists({ instanceId: instanceId, taskId, t });
	await db.deletes('task_taggings', { task_id: taskId, tag_id: tagId }).run(pool);
	const parsed = parse(schema.del, { success: true });
	//need to delete the redis key whether the task is completed or not...
	await redis.del(redisString(instanceId, adminId, false));
	await redis.del(redisString(instanceId, adminId, true));
	return parsed;
}
