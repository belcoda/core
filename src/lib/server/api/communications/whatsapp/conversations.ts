import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/conversations';

import { exists as threadExists } from '$lib/server/api/communications/whatsapp/threads';
import { exists as personExists } from '$lib/server/api/people/people';

function redisStringPerson(instanceId: number, personId: number) {
	return `i:${instanceId}:person:${personId}:whatsapp_conversations`;
}
function redisStringThread(instanceId: number, threadId: number) {
	return `i:${instanceId}:whatsapp_thread:${threadId}:conversations`;
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
	await threadExists({ instanceId, threadId: parsed.thread_id, t: t });
	await personExists({ instanceId, personId: parsed.person_id, t: t });
	const result = await db.insert('communications.whatsapp_conversations', parsed).run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisStringThread(instanceId, parsed.thread_id));
	await redis.del(redisStringPerson(instanceId, parsed.person_id));
	return parsedResult;
}

export async function read({
	instanceId,
	conversationId,
	t
}: {
	instanceId: number;
	conversationId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const result = await db
		.selectExactlyOne('communications.whatsapp_conversations', {
			id: conversationId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:CONVERSATIONS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);

	await personExists({ instanceId, personId: parsedResult.person_id, t: t });
	//await threadExists({ instanceId, threadId: parsedResult.thread_id, t: t });

	return parsedResult;
}

export async function listForPerson({
	instanceId,
	personId,
	url,
	t
}: {
	instanceId: number;
	personId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	await personExists({ instanceId, personId, t: t });
	const { options, filtered } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisStringPerson(instanceId, personId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'communications.whatsapp_conversations',
			{ person_id: personId },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_conversations', { person_id: personId })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) {
		await redis.set(redisStringPerson(instanceId, personId), parsedResult);
	}
	return parsedResult;
}

export async function listForThread({
	instanceId,
	threadId,
	url,
	t
}: {
	instanceId: number;
	threadId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	await threadExists({ instanceId, threadId, t: t });
	const { options, filtered } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisStringThread(instanceId, threadId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'communications.whatsapp_conversations',
			{ thread_id: threadId },
			{ limit: options.limit, offset: options.offset }
		)
		.run(pool);
	const parsedResult = parse(schema.list, result);
	if (!filtered) {
		await redis.set(redisStringThread(instanceId, threadId), parsedResult);
	}
	return parsedResult;
}

export async function update({
	instanceId,
	threadId,
	personId,
	conversationId,
	body,
	t
}: {
	instanceId: number;
	conversationId: number;
	personId?: number;
	threadId?: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	if (!personId && !threadId)
		throw new BelcodaError(
			403,
			'DATA:COMMUNICATIONS:WHATSAPP:CONVERSATIONS:UPDATE:01',
			m.royal_aware_jay_build()
		);
	if (threadId) await threadExists({ instanceId, threadId, t: t });
	if (personId) await personExists({ instanceId, personId, t: t });
	const result = await db
		.update('communications.whatsapp_conversations', { id: conversationId }, parsed)
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:CONVERSATIONS:UPDATE:02',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result[0]);
	await redis.del(redisStringThread(instanceId, parsedResult.thread_id));
	await redis.del(redisStringPerson(instanceId, parsedResult.person_id));
	return parsedResult;
}

export async function _idempotentUpdateExpiryTime({
	whatsappId,
	expiresAt
}: {
	whatsappId: string;
	expiresAt: Date;
}) {
	await db
		.update(
			'communications.whatsapp_conversations',
			{ expires_at: expiresAt },
			{ whatsapp_id: whatsappId }
		)
		.run(pool);
}

export async function getActiveForPerson({
	instanceId,
	personId,
	t
}: {
	instanceId: number;
	personId: number;
	t: App.Localization;
}): Promise<boolean> {
	await personExists({ instanceId, personId, t });
	const result = await db
		.select('communications.whatsapp_conversations', {
			person_id: personId,
			expires_at: db.conditions.after(db.conditions.now)
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:CONVERSATIONS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});

	if (result.length > 0) {
		return true;
	} else {
		return false;
	}
}
