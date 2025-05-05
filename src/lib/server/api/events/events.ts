import { db, pool, redis, type s, BelcodaError, filterQuery, pino } from '$lib/server';
import { DEFAULT_COUNTRY } from '$lib/i18n';
import { parse, slug } from '$lib/schema/valibot';

import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/events/events';
import type { Read as ReadInstance } from '$lib/schema/core/instance';
import { slugify } from '$lib/utils/text/string';
import { randomUUID } from 'crypto';
import { type EventHTMLMetaTags } from '$lib/schema/utils/openai';
import { read as readInstance } from '$lib/server/api/core/instances';
import { create as createEmailMessage } from '$lib/server/api/communications/email/messages';

const log = pino(import.meta.url);

export function redisString(instanceId: number, eventId: number | 'all') {
	return `i:${instanceId}:events:${eventId}`;
}

export function redisStringSlug(instanceId: number, slug: string) {
	return `i:${instanceId}:eventslug:${slug}`;
}

export async function exists({
	instanceId,
	eventId
}: {
	instanceId: number;
	eventId: number;
}): Promise<boolean> {
	const cached = await redis.get(redisString(instanceId, eventId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('events.events', {
			instance_id: instanceId,
			id: eventId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
	return true;
}

export async function create({
	instanceId,
	body,
	adminId,
	queue
}: {
	instanceId: number;
	body: schema.Create;
	adminId: number;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const instance = await readInstance({ instance_id: instanceId });

	const toInsert = {
		instance_id: instanceId,

		point_person_id: parsed.point_person_id || adminId,
		country: parsed.country || instance.country || DEFAULT_COUNTRY,
		...parsed
	};

	// function to insert a guaranteed unique name and slug based on the heading
	// after checking to ensure the name and slug are unique, it inserts the item
	const result = await db.transaction(pool, db.IsolationLevel.Serializable, async (txnClient) => {
		const baseName = parsed.name || parsed.heading;
		const baseSlug = parsed.slug || slugify(parsed.heading);
		let uniqueName = baseName;
		let uniqueSlug = baseSlug;
		let counter = 1;
		while (true) {
			const exists =
				await db.sql`SELECT id FROM events.events WHERE instance_id = ${db.param(instanceId)} AND (name = ${db.param(uniqueName)} OR slug = ${db.param(uniqueSlug)})`.run(
					txnClient
				);

			if (exists.length === 0) {
				// Both are unique
				break;
			}

			// Increment counter and modify name and slug
			uniqueName = `${baseName} (${counter})`;
			uniqueSlug = `${baseSlug}_${counter}`;
			counter += 1;
		}
		return await db
			.insert('events.events', {
				...toInsert,
				name: toInsert.name || uniqueName,
				slug: toInsert.slug || uniqueSlug
			})
			.run(txnClient);
	});

	await redis.del(redisString(instanceId, 'all'));
	const returned = await read({ instanceId, eventId: result.id });
	const htmlMeta: EventHTMLMetaTags = { type: 'event', eventId: returned.id };
	await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	return returned;
}

export async function update({
	instanceId,
	eventId,
	body,
	queue,
	skipMetaGeneration = false
}: {
	instanceId: number;
	eventId: number;
	body: schema.Update;
	queue: App.Queue;
	skipMetaGeneration?: boolean;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('events.events', parsed, {
			instance_id: instanceId,
			id: eventId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(404, 'DATA:EVENTS:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
	const returned = await read({ instanceId, eventId });
	await redis.del(redisStringSlug(instanceId, returned.slug));
	const htmlMeta: EventHTMLMetaTags = { type: 'event', eventId: eventId };
	if (skipMetaGeneration !== true) {
		await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	}
	return returned;
}

export async function read({
	instanceId,
	eventId,
	includeDeleted = false
}: {
	instanceId: number;
	eventId: number;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, eventId));
	if (!includeDeleted && cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne(
			'events.events',
			{
				instance_id: instanceId,
				id: eventId,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
				lateral: {
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),

					followup_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('followup_email')
					}),

					registered: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'registered'
					}),
					attended: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'attended'
					}),
					cancelled: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'cancelled'
					}),
					noshow: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'noshow'
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, eventId), parsedResult);
	return parsedResult;
}

export async function readBySlug({
	instanceId,
	slug
}: {
	instanceId: number;
	slug: string;
}): Promise<schema.Read> {
	const cached = await redis.get(redisStringSlug(instanceId, slug));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne(
			'events.events',
			{ instance_id: instanceId, slug, deleted_at: db.conditions.isNull },
			{
				lateral: {
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),

					followup_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('followup_email')
					}),

					registered: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'registered'
					}),
					attended: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'attended'
					}),
					cancelled: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'cancelled'
					}),
					noshow: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'noshow'
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:EVENTS:READBYSLUG:01', 'Event not found', err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisStringSlug(instanceId, slug), parsedResult);
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
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (!includeDeleted && cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'events.events',
			{
				instance_id: instanceId,
				...filter.where,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
				lateral: {
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					registered: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'registered'
					}),
					attended: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'attended'
					}),
					cancelled: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'cancelled'
					}),
					noshow: db.count('events.attendees', {
						event_id: db.parent('id'),
						status: 'noshow'
					})
				},
				...filter.options
			}
		)
		.run(pool);
	const count = await db
		.count('events.events', {
			instance_id: instanceId,
			...filter.where,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });

	if (filter.filtered !== true) {
		await redis.set(redisString(instanceId, 'all'), parsedResult);
	}
	return parsedResult;
}

export async function selectEventsForReminderFollowupEmail(): Promise<{
	reminders: { id: number; instance_id: number; point_person_id: number }[];
	followups: { id: number; instance_id: number; point_person_id: number }[];
}> {
	const reminders = await db.sql<
		s.events.events.SQL,
		s.events.events.Selectable[]
	>`SELECT ${'id'}, ${'instance_id'}, ${'point_person_id'} FROM events.events WHERE deleted_at IS NULL AND send_reminder_email = true AND reminder_sent_at IS NULL AND starts_at < NOW() AND starts_at > NOW() - INTERVAL '1 hour' * send_reminder_hours_before_start`.run(
		pool
	);
	const followups = await db.sql<
		s.events.events.SQL,
		s.events.events.Selectable[]
	>`SELECT ${'id'}, ${'instance_id'}, ${'point_person_id'}  FROM ${'events.events'} WHERE deleted_at IS NULL AND ${'send_followup_email'} = ${db.param(true)} AND ${'followup_sent_at'} IS NULL AND ${'ends_at'} < NOW() AND ${'ends_at'} > NOW() - INTERVAL '1 hour' * ${'send_followup_hours_after_end'}`.run(
		pool
	);
	return {
		reminders,
		followups
	};
}

export async function setEventReminderFollowupEmailSent({
	eventId,
	instanceId,
	type
}: {
	eventId: number;
	instanceId: number;
	type: 'reminder' | 'followup';
}) {
	switch (type) {
		case 'reminder': {
			await db
				.update(
					'events.events',
					{ reminder_sent_at: new Date(Date.now()) },
					{ id: eventId, instance_id: instanceId }
				)
				.run(pool);
			break;
		}
		case 'followup': {
			await db
				.update(
					'events.events',
					{ followup_sent_at: new Date(Date.now()) },
					{ id: eventId, instance_id: instanceId }
				)
				.run(pool);
			break;
		}
	}
	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
}

export async function del({
	instanceId,
	eventId
}: {
	instanceId: number;
	eventId: number;
}): Promise<void> {
	if (!(await exists({ instanceId, eventId }))) {
		throw new BelcodaError(404, 'DATA:EVENTS:DEL:01', m.pretty_tired_fly_lead());
	}
	await db
		.update('events.events', { deleted_at: new Date() }, { instance_id: instanceId, id: eventId })
		.run(pool);

	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
}
