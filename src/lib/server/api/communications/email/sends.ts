import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/email/sends';
import { parse } from '$lib/schema/valibot';
import { type SendEmailToListSchema } from '$lib/schema/utils/email';

import { exists as messageExists } from '$lib/server/api/communications/email/messages';

import * as m from '$lib/paraglide/messages';
function redisString(instanceId: number, messageId: number, sendId: number | 'all') {
	return `i:${instanceId}:email:${messageId}:sends:${sendId}`;
}

export async function create({
	instanceId,
	body,
	t
}: {
	instanceId: number;
	body: schema.Create;
	adminId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	// the foreign key constraint will ensure that a message exists...
	// but we don't want to allow creating a send on a message that belongs to another instance

	const parsed = parse(schema.create, body);
	await messageExists({
		instanceId,
		messageId: parsed.message_id,
		t
	});
	const toInsert = {
		instance_id: instanceId,
		...parsed
	};
	const inserted = await db.insert('communications.email_sends', toInsert).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, parsed.message_id, 'all'));
	await redis.set(redisString(instanceId, parsed.message_id, parsedInserted.id), parsedInserted);
	return parsedInserted;
}

export async function read({
	instanceId,
	sendId,
	messageId
}: {
	instanceId: number;
	sendId: number;
	messageId: number;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, messageId, sendId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const selected = await db
		.selectExactlyOne('communications.email_sends', {
			id: sendId,
			instance_id: instanceId,
			message_id: messageId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:EMAIL:SENDS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	await redis.set(redisString(instanceId, messageId, sendId), selected);
	return parse(schema.read, selected);
}

export async function update({
	instanceId,
	t,
	sendId,
	messageId,
	body
}: {
	instanceId: number;
	t: App.Localization;
	sendId: number;
	messageId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('communications.email_sends', parsed, {
			id: sendId,
			instance_id: instanceId,
			message_id: messageId
		})
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:SENDS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, messageId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, messageId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function markAsStarted({
	instanceId,
	sendId,
	messageId,
	t
}: {
	instanceId: number;
	sendId: number;
	messageId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const updated = await db
		.update(
			'communications.email_sends',
			{ started_at: db.conditions.now },
			{
				id: sendId,
				instance_id: instanceId,
				message_id: messageId,
				started_at: db.conditions.isNull,
				completed_at: db.conditions.isNull
			}
		)
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:SENDS:MARK_AS_STARTED:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, messageId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, messageId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function markAsComplete({
	instanceId,
	sendId,
	messageId,
	t
}: {
	instanceId: number;
	sendId: number;
	messageId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const updated = await db
		.update(
			'communications.email_sends',
			{ completed_at: db.conditions.now },
			{ id: sendId, instance_id: instanceId, message_id: messageId }
		)
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:SENDS:MARK_AS_STARTED:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, messageId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, messageId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function list({
	instanceId,
	messageId,
	url
}: {
	instanceId: number;
	messageId: number;
	url: URL;
}) {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, messageId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const selected = await db
		.select(
			'communications.email_sends',
			{ instance_id: instanceId, message_id: messageId, ...query.where },
			{
				...query.options
			}
		)
		.run(pool);
	const count = await db
		.count('communications.email_sends', {
			instance_id: instanceId,
			message_id: messageId,
			...query.where
		})
		.run(pool);
	const parsedSelected = parse(schema.list, { items: selected, count });
	if (!query.filtered) await redis.set(redisString(instanceId, messageId, 'all'), parsedSelected);
	return parsedSelected;
}

export async function send({
	instanceId,
	sendId,
	messageId,
	adminId,
	queue,
	t
}: {
	instanceId: number;
	messageId: number;
	sendId: number;
	adminId: number;
	queue: App.Queue;
	t: App.Localization;
}): Promise<void> {
	// the foreign key constraint will ensure that a message exists...
	// but we don't want to allow sending a message that belongs to another instance
	await messageExists({
		instanceId,
		messageId,
		t
	});
	//make sure the message exists
	await read({
		instanceId,
		sendId,
		messageId
	});
	//make sure send belongs to the correct message
	const sendObject: SendEmailToListSchema = {
		send_id: sendId,
		message_id: messageId
	};
	await queue('/utils/email/send_to_list', instanceId, sendObject, adminId);
}
