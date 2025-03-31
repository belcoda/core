import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import { type EmailPreviewOptions } from '$lib/schema/utils/openai';
function redisString(instanceId: number, messageId: number | 'all') {
	return `i:${instanceId}:email_messages:${messageId}`;
}
import { read as readTemplate } from '$lib/server/api/communications/email/templates';

import * as m from '$lib/paraglide/messages';

export async function exists({
	instanceId,
	messageId,
	t
}: {
	instanceId: number;
	messageId: number;
	t: App.Localization;
}): Promise<true> {
	const cached = await redis.get(redisString(instanceId, messageId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('communications.email_messages', { id: messageId, instance_id: instanceId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:EMAIL:MESSAGES:EXISTS:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	return true;
}

export async function create({
	instanceId,
	defaultTemplateId,
	body,
	queue,
	t
}: {
	instanceId: number;
	defaultTemplateId: number;
	body: schema.Create;
	queue: App.Queue;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const toInsert = {
		instance_id: instanceId,
		template_id: parsed.template_id || defaultTemplateId,
		...parsed
	};

	const inserted = await db.insert('communications.email_messages', toInsert).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedInserted.id), parsedInserted);

	// if the preview text is the same as the template preview text, then we know we are safe to autogenerate the preview
	const template = await readTemplate({ instanceId, templateId: toInsert.template_id, t: t });
	if (parsedInserted.preview_text === template.preview_text) {
		// but, on the contrary, if the preview text is different, that means it was manually set and we should not autogenerate the preview
		const sendToQueue: EmailPreviewOptions = {
			emailMessageId: parsedInserted.id
		};
		await queue('/utils/openai/generate_email_preview', instanceId, sendToQueue);
	}
	return parsedInserted;
}

export async function update({
	instanceId,
	messageId,
	body,
	t,
	queue
}: {
	instanceId: number;
	messageId: number;
	body: schema.Update;
	t: App.Localization;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const toUpdate = {
		...parsed
	};

	// if the preview text is the same as before, we should autogenerate the preview because it was not manually set
	/*
	NOTE: This current implementation is imperfect.
	If a user provides a manually created preview, saves it, then makes additional changes to the email and saves those changes again --
	the system will trigger an automatic generation of new preview text which will overwrite their manually created one. 
	I'm pretty sure avoiding this outcome would require a database migration to add a new flag for the communications.email_messages table. 
	Given that this is a very low priority feature and custom preview text is very unlikely to be a priority for any of our users in the foreseeable future, 
	I'm happy leaving it as is and coming back to it later.
	*/
	const messageBeforeUpdate = await read({ instanceId, messageId, t });
	const autogeneratePreview = messageBeforeUpdate.preview_text === parsed.preview_text;

	const updated = await db
		.update('communications.email_messages', toUpdate, { id: messageId, instance_id: instanceId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:EMAIL:MESSAGES:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedUpdated = parse(schema.read, updated[0]);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedUpdated.id), parsedUpdated);
	if (autogeneratePreview) {
		const sendToQueue: EmailPreviewOptions = {
			emailMessageId: parsedUpdated.id
		};
		await queue('/utils/openai/generate_email_preview', instanceId, sendToQueue);
	}
	return parsedUpdated;
}

export async function read({
	instanceId,
	messageId,
	t
}: {
	instanceId: number;
	messageId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, messageId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const read = await db
		.selectExactlyOne('communications.email_messages', { id: messageId, instance_id: instanceId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:EMAIL:MESSAGES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedRead = parse(schema.read, read);
	await redis.set(redisString(instanceId, parsedRead.id), parsedRead);
	return parsedRead;
}

export async function list({
	instanceId,
	url,
	t
}: {
	instanceId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const list = await db
		.select(
			'communications.email_messages',
			{ instance_id: instanceId, ...query.where },
			query.options
		)
		.run(pool);
	const parsedList = parse(schema.list, list);
	await redis.set(redisString(instanceId, 'all'), parsedList);
	return parsedList;
}
