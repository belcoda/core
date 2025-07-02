import { db, pool, redis, pino, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/communications/whatsapp/sent_whatsapp_messages';
import { exists as personExists } from '$lib/server/api/people/people';

function redisString(instanceId: number, personId: number) {
	return `i:${instanceId}:person:${personId}:sent_whatsapp_messages`;
}

const log = pino(import.meta.url);
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
	const result = await db.insert('communications.sent_whatsapp_messages', parsed).run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, parsed.person_id));
	return parsedResult;
}

export async function read({
	instanceId,
	personId,
	messageId,
	t
}: {
	instanceId: number;
	personId: number;
	messageId: string;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, personId));
	if (cached) {
		return parse(schema.read, cached);
	}
	await personExists({ instanceId, personId });
	const result = await db
		.selectExactlyOne('communications.sent_whatsapp_messages', {
			person_id: personId,
			id: messageId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:SENT_MESSAGES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, personId), parsedResult);
	return parsedResult;
}

export async function list({
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
	const { filtered, options } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, personId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	await personExists({ instanceId, personId });
	const result = await db
		.select('communications.sent_whatsapp_messages', { person_id: personId }, options)
		.run(pool);
	const count = await db
		.count('communications.sent_whatsapp_messages', { person_id: personId })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) await redis.set(redisString(instanceId, personId), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	personId,
	messageId,
	body,
	t
}: {
	instanceId: number;
	personId: number;
	messageId: string;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	await personExists({ instanceId, personId });
	const result = await db
		.update('communications.sent_whatsapp_messages', parsed, {
			person_id: personId,
			message_id: messageId
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:SENT_MESSAGES:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result[0]);
	await redis.del(redisString(instanceId, personId));
	return parsedResult;
}

//this function is unsafe because we're not checking that the messageId or the personId belong to the instance
export async function _getSentWhatsappMessageById({
	sentMessageId
}: {
	sentMessageId: string;
}): Promise<schema.Read> {
	const result = await db
		.selectExactlyOne('communications.sent_whatsapp_messages', {
			id: sentMessageId
		})
		.run(pool);
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}
