import { db, pool, redis, pino, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { type SupportedLanguage } from '$lib/i18n';
import * as m from '$lib/paraglide/messages';
import * as schema from '$lib/schema/communications/whatsapp/threads';
import { read as readTemplate } from '$lib/server/api/communications/whatsapp/templates';
import { create as createMessage } from '$lib/server/api/communications/whatsapp/messages';
function redisString(instanceId: number, templateId: number | 'all') {
	return `i:${instanceId}:whatsapp_threads:${templateId}`;
}
const log = pino(import.meta.url);

export async function exists({
	instanceId,
	threadId
}: {
	instanceId: number;
	threadId: number;
}): Promise<boolean> {
	const cached = await redis.get(redisString(instanceId, threadId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('communications.whatsapp_threads', { instance_id: instanceId, id: threadId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:THREADS:EXISTS:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	return true;
}

export async function create({
	instanceId,
	body,
	t,
	defaultTemplateId,
	adminId,
	instanceLanguage
}: {
	instanceId: number;
	body: schema.Create;
	t: App.Localization;
	defaultTemplateId: number;
	adminId: number;
	instanceLanguage: SupportedLanguage;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const template = await readTemplate({ instanceId, templateId: defaultTemplateId, t: t });
	const typeTemplate: 'template' = 'template'; //needed to avoid typescript errors due to literal types in validation
	const languagePolicy: 'deterministic' = 'deterministic'; //needed to avoid typescript errors due to literal types in validation
	const createdMesaage = await createMessage({
		instanceId,
		body: {
			message: {
				type: typeTemplate,
				template: {
					name: template.message.name,
					language: { code: instanceLanguage, policy: languagePolicy },
					components: []
				}
			}
		}
	});
	const toInsert = {
		name: parsed.name,
		template_id: defaultTemplateId,
		point_person_id: adminId,
		template_message_id: createdMesaage.id
	};

	const result = await db
		.insert('communications.whatsapp_threads', { instance_id: instanceId, ...toInsert })
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	return parsedResult;
}

export async function read({
	instanceId,
	threadId
}: {
	instanceId: number;
	threadId: number;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, threadId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne('communications.whatsapp_threads', {
			instance_id: instanceId,
			id: threadId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:WHATSAPP:THREADS:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, threadId), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url,
	includeDeleted = false
}: {
	instanceId: number;
	url: URL;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	const { filtered, where, options } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
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
			'communications.whatsapp_threads',
			{ instance_id: instanceId, ...whereWithDeleted },
			options
		)
		.run(pool);
	const count = await db
		.count('communications.whatsapp_threads', { instance_id: instanceId, ...whereWithDeleted })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (!filtered) {
		await redis.set(redisString(instanceId, 'all'), parsedResult);
	}
	return parsedResult;
}

export async function update({
	instanceId,
	threadId,
	body
}: {
	instanceId: number;
	threadId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('communications.whatsapp_threads', parsed, {
			instance_id: instanceId,
			id: threadId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:COMMUNICATIONS:WHATSAPP:THREADS:UPDATE:01',
			m.pretty_tired_fly_lead()
		);
	}
	const parsedResult = parse(schema.read, result[0]);
	await redis.del(redisString(instanceId, 'all'));
	await redis.set(redisString(instanceId, threadId), parsedResult);
	return parsedResult;
}

export async function _getThreadByStartingMessageId({
	instanceId,
	startingMessageId
}: {
	instanceId: number;
	startingMessageId: string;
}): Promise<schema.Read> {
	const selected = await db
		.selectExactlyOne('communications.whatsapp_threads', {
			instance_id: instanceId,
			template_message_id: startingMessageId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	const parsed = parse(schema.read, selected);
	return parsed;
}

export async function del({
	instanceId,
	threadId
}: {
	instanceId: number;
	threadId: number;
}): Promise<void> {
	// delete thread messages
	await deleteThreadMessages({ instanceId, threadId });
	// then delete thread
	await db
		.update(
			'communications.whatsapp_threads',
			{ deleted_at: new Date() },
			{ instance_id: instanceId, id: threadId }
		)
		.run(pool);
	// clear cache
	await redis.del(redisString(instanceId, 'all'));
	await redis.del(redisString(instanceId, threadId));
}

async function deleteThreadMessages({
	instanceId,
	threadId
}: {
	instanceId: number;
	threadId: number;
}): Promise<void> {
	await db
		.update(
			'communications.whatsapp_messages',
			{ deleted_at: new Date() },
			{ instance_id: instanceId, thread_id: threadId }
		)
		.run(pool);
}
