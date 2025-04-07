import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/messages';
import { type ActionArray, actionArray } from '$lib/schema/communications/actions/actions';
import type { Message } from '$lib/schema/communications/whatsapp/elements/message';

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
		.select(
			'communications.whatsapp_messages',
			{ thread_id: threadId, ...where },
			{ ...options, order: { by: 'created_at', direction: 'ASC' } }
		)
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
			m.pretty_tired_fly_lead()
		);
	}
	const parsed = parse(actionArray, actions[0].action);
	return parsed;
}

export async function _getByAction({
	action,
	t
}: {
	action: string;
	t: App.Localization;
}): Promise<{ actions: ActionArray; messageId: string }> {
	const result = await db.sql`SELECT id, actions->${db.param(action)} AS action
FROM communications.whatsapp_messages
WHERE actions ? ${db.param(action)}`.run(pool);
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

export function constructWhatsappNotification({
	eventType,
	action,
	activityTitle,
	t
}: {
	eventType: string;
	action: string;
	activityTitle: string;
	t: App.Localization;
}): Message {
	let baseText = constructLocalizedNotificationMessageText({
		eventType,
		action,
		activityTitle
	});

	const message: Message = {
		text: {
			body: baseText,
			preview_url: true
		},
		type: 'text'
	};
	return message;
}

export function constructLocalizedNotificationMessageText({
	eventType,
	action,
	activityTitle
}: {
	eventType: string;
	action: string;
	activityTitle: string;
}): string {
	switch (eventType) {
		case 'event': {
			switch (action) {
				case 'register':
					return m.solid_mellow_eel_chop({ activityTitle });
				case 'cancel':
					return m.cute_few_giraffe_blend({ activityTitle });
				case 'duplicate':
					return m.jumpy_alive_puffin_vent({ activityTitle });
				default:
					throw new BelcodaError(
						500,
						'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_BY_EVENT_TYPE_AND_ACTION:01',
						`Unable to construct localized message text for event type ${eventType} and action ${action}`
					);
			}
		}
		case 'petition':
			switch (action) {
				case 'sign':
					return m.full_tangy_cow_pull({ activityTitle });
				case 'cancel':
					return m.dizzy_mellow_otter_clap({ activityTitle });
				case 'duplicate':
					return m.east_north_osprey_hurl({ activityTitle });
				default:
					throw new BelcodaError(
						500,
						'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_BY_EVENT_TYPE_AND_ACTION:02',
						`Unable to construct localized message text for petition type ${eventType} and action ${action}`
					);
			}
		default: {
			throw new BelcodaError(
				500,
				'DATA:COMMUNICATIONS:WHATSAPP:MESSAGES:GET_BY_EVENT_TYPE_AND_ACTION:03',
				`Misformed petition or event type: ${eventType} and action ${action}`
			);
		}
	}
}
