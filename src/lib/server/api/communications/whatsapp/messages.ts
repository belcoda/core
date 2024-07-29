import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as schema from '$lib/schema/communications/whatsapp/messages';
import { type ActionArray, actionArray } from '$lib/schema/communications/actions/actions';

function redisString(instanceId: number, threadId: number) {
	return `i:${instanceId}:wa_thread:${threadId}:msgs`;
}

export async function create({
	instanceId,
	threadId,
	body
}: {
	instanceId: number;
	threadId?: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
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
	t
}: {
	instanceId: number;
	threadId?: number;
	messageId: string;
	t: App.Localization;
}): Promise<schema.Read> {
	if (threadId) {
		const cached = await redis.get(redisString(instanceId, threadId));
		if (cached) {
			return parse(schema.read, cached);
		}
	}
	const result = await db
		.selectExactlyOne('communications.whatsapp_messages', {
			instance_id: instanceId,
			id: messageId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:READ:01',
				t.errors.not_found(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function list({
	instanceId,
	threadId,
	url
}: {
	instanceId: number;
	threadId: number;
	url: URL;
}): Promise<schema.List> {
	const { filtered, options, where } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, threadId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select('communications.whatsapp_messages', { thread_id: threadId, ...where }, options)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_messages', { thread_id: threadId, ...where })
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
	body,
	t
}: {
	instanceId: number;
	messageId: string;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.whatsapp_messages', parsed, { instance_id: instanceId, id: messageId })
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:READ:01',
			t.errors.not_found()
		);
	}
	const parsedResult = parse(schema.read, result[0]);
	if (parsedResult.thread_id) await redis.del(redisString(instanceId, parsedResult.thread_id));
	return parsedResult;
}

export async function _getActions({
	actionId,
	instanceId,
	t
}: {
	actionId: string;
	instanceId: number;
	t: App.Localization;
}): Promise<ActionArray> {
	const actions = await db.sql`SELECT actions->${db.param(actionId)} AS action
    FROM ${'communications.whatsapp_messages'}
    WHERE actions ? ${db.param(actionId)} AND instance_id = ${db.param(instanceId)}`.run(pool);
	if (actions.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_ACTIONS:01',
			t.errors.not_found()
		);
	}
	const parsed = parse(actionArray, actions[0].action);
	return parsed;
}
