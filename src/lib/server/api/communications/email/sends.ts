import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/email/sends';
import { type Create as CreateMessage } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import { create as createMessage } from '$lib/server/api/communications/email/messages';
import { read as readTemplate } from '$lib/server/api/communications/email/templates';
import { randomUUID } from 'crypto';
import * as m from '$lib/paraglide/messages';
function redisString(instanceId: number, sendId: number | 'all') {
	return `i:${instanceId}:email_sends:${sendId}`;
}

export async function create({
	instanceId,
	body,
	defaultTemplateId,
	t,
	adminId,
	queue
}: {
	instanceId: number;
	body: schema.Create;
	defaultTemplateId: number;
	adminId: number;
	t: App.Localization;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const template = await readTemplate({ instanceId, templateId: defaultTemplateId, t });
	const messageBody: CreateMessage = {
		name: randomUUID(),
		template_id: template.id,
		subject: template.subject,
		html: '',
		text: '',
		preview_text: template.preview_text,
		from: template.from,
		reply_to: template.reply_to,
		point_person_id: adminId,
		use_html_for_plaintext: true
	};
	const message = await createMessage({
		instanceId,
		defaultTemplateId,
		body: messageBody,
		queue: queue,
		t
	});
	const toInsert = {
		instance_id: instanceId,
		message_id: message.id,
		...parsed
	};
	const inserted = await db.insert('communications.email_sends', toInsert).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedInserted.id), parsedInserted);
	return parsedInserted;
}

export async function read({
	instanceId,
	sendId,
	t
}: {
	instanceId: number;
	sendId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, sendId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const selected = await db
		.selectExactlyOne('communications.email_sends', { id: sendId, instance_id: instanceId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:EMAIL:SENDS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	await redis.set(redisString(instanceId, sendId), selected);
	return parse(schema.read, selected);
}

export async function update({
	instanceId,
	t,
	sendId,
	body
}: {
	instanceId: number;
	t: App.Localization;
	sendId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('communications.email_sends', parsed, { id: sendId, instance_id: instanceId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:SENDS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function markAsStarted({
	instanceId,
	sendId,
	t
}: {
	instanceId: number;
	sendId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const updated = await db
		.update(
			'communications.email_sends',
			{ started_at: db.conditions.now },
			{
				id: sendId,
				instance_id: instanceId,
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
	await redis.del(redisString(instanceId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function markAsComplete({
	instanceId,
	sendId,
	t
}: {
	instanceId: number;
	sendId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const updated = await db
		.update(
			'communications.email_sends',
			{ completed_at: db.conditions.now },
			{ id: sendId, instance_id: instanceId }
		)
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:SENDS:MARK_AS_STARTED:01',
			m.pretty_tired_fly_lead()
		);
	}
	await redis.del(redisString(instanceId, 'all'));
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.set(redisString(instanceId, sendId), parsedUpdated);
	return parsedUpdated;
}

export async function list({
	instanceId,
	t,
	url
}: {
	instanceId: number;
	t: App.Localization;
	url: URL;
}) {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const selected = await db
		.select(
			'communications.email_sends',
			{ instance_id: instanceId, ...query.where },
			{
				...query.options
			}
		)
		.run(pool);
	const count = await db
		.count('communications.email_sends', { instance_id: instanceId, ...query.where })
		.run(pool);
	const parsedSelected = parse(schema.list, { items: selected, count });
	if (!query.filtered) await redis.set(redisString(instanceId, 'all'), parsedSelected);
	return parsedSelected;
}

export async function send({
	instanceId,
	sendId,
	adminId,
	queue,
	t
}: {
	instanceId: number;
	sendId: number;
	adminId: number;
	queue: App.Queue;
	t: App.Localization;
}): Promise<void> {
	const sendObject = await read({ instanceId, sendId, t });
	await queue('/utils/email/send_to_list', instanceId, sendObject, adminId);
}
