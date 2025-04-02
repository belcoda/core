import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/messages';
import { type ActionArray, actionArray } from '$lib/schema/communications/actions/actions';

function redisString(instanceId: number, threadId: number) {
	return `i:${instanceId}:wa_thread:${threadId}:msgs`;
}
export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const toParse: schema.Create = {
		...body
	};
	const parsed = parse(schema.create, toParse);
	const result = await db
		.insert('communications.whatsapp_messages', { instance_id: instanceId, ...parsed })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	if (parsed.thread_id) await redis.del(redisString(instanceId, parsed.thread_id));
	return parsedResult;
}

export async function read({
	instanceId,
	threadId,
	messageId,
	includeDeleted = false
}: {
	instanceId: number;
	threadId?: number;
	messageId: string;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	if (threadId && !includeDeleted) {
		const cached = await redis.get(redisString(instanceId, threadId));
		if (cached) {
			return parse(schema.read, cached);
		}
	}
	const result = await db
		.selectExactlyOne('communications.whatsapp_messages', {
			instance_id: instanceId,
			id: messageId,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function list({
	instanceId,
	threadId,
	url,
	includeDeleted = false
}: {
	instanceId: number;
	threadId: number;
	url: URL;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	const { filtered, options, where } = filterQuery(url);
	if (!filtered && !includeDeleted) {
		const cached = await redis.get(redisString(instanceId, threadId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const whereWithDeleted = {
		...where,
		...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
	};
	const result = await db
		.select(
			'communications.whatsapp_messages',
			{ thread_id: threadId, ...whereWithDeleted },
			{
				...options,
				order: { by: 'created_at', direction: 'ASC' }
			}
		)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_messages', { thread_id: threadId, ...whereWithDeleted })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) {
		await redis.set(redisString(instanceId, threadId), parsedResult);
	}
	return parsedResult;
}

export async function update({
	instanceId,
	messageId,
	body
}: {
	instanceId: number;
	messageId: string;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.whatsapp_messages', parsed, {
			instance_id: instanceId,
			id: messageId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result[0]);
	if (parsedResult.thread_id) await redis.del(redisString(instanceId, parsedResult.thread_id));
	return parsedResult;
}

export async function _getActions({
	actionId,
	instanceId
}: {
	actionId: string;
	instanceId: number;
}): Promise<ActionArray> {
	const actions = await db.sql`SELECT actions->${db.param(actionId)} AS action
    FROM ${'communications.whatsapp_messages'}
    WHERE actions ? ${db.param(actionId)} AND instance_id = ${db.param(instanceId)} AND deleted_at = ${db.conditions.isNull}`.run(
		pool
	);
	if (actions.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_ACTIONS:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsed = parse(actionArray, actions[0].action);
	return parsed;
}

export async function _getByAction({
	action
}: {
	action: string;
}): Promise<{ actions: ActionArray; messageId: string }> {
	const result = await db.sql`SELECT id, actions->${db.param(action)} AS action
FROM communications.whatsapp_messages
WHERE actions ? ${db.param(action)} AND deleted_at = ${db.conditions.isNull}`.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_BY_ACTION:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsed = parse(actionArray, result[0].action);
	return { messageId: result[0].id, actions: parsed };
}
