import { BelcodaError, db, redis, pool, pino, filterQuery } from '$lib/server';
import * as schema from '$lib/schema/core/tasks';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

export function redisString(instanceId: number, adminId: number, completed: boolean): string {
	return `i:${instanceId}:tasks:${adminId}:${completed ? 'c' : 'nc'}`;
}

export async function exists({
	instanceId,
	taskId,
	t
}: {
	instanceId: number;
	taskId: number;
	t: App.Localization;
}): Promise<void> {
	await db
		.selectExactlyOne('tasks', { instance_id: instanceId, id: taskId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:TASKS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
}

export async function create({
	instanceId,
	adminId,
	body,
	t
}: {
	instanceId: number;
	adminId: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const inserted = await db
		.insert('tasks', { instance_id: instanceId, assigned_to: adminId, ...parsed })
		.run(pool);
	const selected = await db
		.selectExactlyOne(
			'tasks',
			{ instance_id: instanceId, id: inserted.id },
			{
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('assigned_to') })
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:TASKS:UPDATE:02', m.pretty_tired_fly_lead(), err);
		});
	const parsedInserted = parse(schema.read, selected);
	await redis.del(redisString(instanceId, adminId, false));
	return parsedInserted;
}

export async function update({
	instanceId,
	t,
	taskId,
	adminId,
	body
}: {
	instanceId: number;
	t: App.Localization;
	adminId: number;
	taskId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('tasks', parsed, { instance_id: instanceId, id: taskId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:TASKS:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, adminId, false));
	await redis.del(redisString(instanceId, adminId, true));
	const selected = await db
		.selectExactlyOne(
			'tasks',
			{ instance_id: instanceId, id: taskId },
			{
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('assigned_to') })
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:TASKS:UPDATE:02', m.pretty_tired_fly_lead(), err);
		});
	const parsedUpdated = parse(schema.read, selected);
	return parsedUpdated;
}

export async function list({
	instanceId,
	adminId,
	url
}: {
	instanceId: number;
	adminId: number;
	url: URL;
}): Promise<schema.List> {
	const { where, options, filtered } = filterQuery(url);
	const showCompleted = url.searchParams.get('completed') === 'true';
	const completedCondition = showCompleted ? db.conditions.isNotNull : db.conditions.isNull;
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, adminId, showCompleted));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const selected = await db
		.select(
			'tasks',
			{ instance_id: instanceId, assigned_to: adminId, completed_at: completedCondition, ...where },
			{
				...options,
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('assigned_to') })
				}
			}
		)
		.run(pool);
	const count = await db
		.count('tasks', {
			instance_id: instanceId,
			assigned_to: adminId,
			completed_at: completedCondition,
			...where
		})
		.run(pool);
	const parsedTasks = parse(schema.list, { items: selected, count });
	await redis.set(redisString(instanceId, adminId, showCompleted), parsedTasks);
	return parsedTasks;
}
