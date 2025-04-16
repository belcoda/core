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
	eventId,
	t
}: {
	instanceId: number;
	eventId: number;
	t: App.Localization;
}): Promise<boolean> {
	const cached = await redis.get(redisString(instanceId, eventId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('events.events', { instance_id: instanceId, id: eventId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
	return true;
}

export async function create({
	instanceId,
	body,
	t,
	defaultEmailTemplateId,
	adminId,
	queue
}: {
	instanceId: number;
	body: schema.Create;
	t: App.Localization;
	defaultEmailTemplateId: number;
	adminId: number;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const instance = await readInstance({ instance_id: instanceId });

	const toInsert = {
		instance_id: instanceId,
		followup_email: await createEventEmailNotification({
			instance,
			adminId,
			instanceId,
			defaultEmailTemplateId,
			type: 'followup',
			body: parsed,
			queue,
			t
		}),
		registration_email: await createEventEmailNotification({
			instance,
			adminId,
			instanceId,
			defaultEmailTemplateId,
			type: 'registration',
			body: parsed,
			queue,
			t
		}),
		reminder_email: await createEventEmailNotification({
			instance,
			adminId,
			instanceId,
			defaultEmailTemplateId,
			type: 'reminder',
			body: parsed,
			queue,
			t
		}),
		cancellation_email: await createEventEmailNotification({
			instance,
			adminId,
			instanceId,
			defaultEmailTemplateId,
			type: 'cancellation',
			body: parsed,
			queue,
			t
		}),
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
	const returned = await read({ instanceId, eventId: result.id, t });
	const htmlMeta: EventHTMLMetaTags = { type: 'event', eventId: returned.id };
	await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	return returned;
}

export async function update({
	instanceId,
	eventId,
	body,
	queue,
	t,
	skipMetaGeneration = false
}: {
	instanceId: number;
	eventId: number;
	body: schema.Update;
	queue: App.Queue;
	t: App.Localization;
	skipMetaGeneration?: boolean;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('events.events', parsed, { instance_id: instanceId, id: eventId })
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(404, 'DATA:EVENTS:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, eventId));
	await redis.del(redisString(instanceId, 'all'));
	const returned = await read({ instanceId, eventId, t });
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
	t
}: {
	instanceId: number;
	eventId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, eventId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne(
			'events.events',
			{ instance_id: instanceId, id: eventId },
			{
				lateral: {
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					reminder_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('reminder_email')
					}),
					registration_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('registration_email')
					}),
					followup_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('followup_email')
					}),
					cancellation_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('cancellation_email')
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
			{ instance_id: instanceId, slug },
			{
				lateral: {
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),
					reminder_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('reminder_email')
					}),
					registration_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('registration_email')
					}),
					followup_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('followup_email')
					}),
					cancellation_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('cancellation_email')
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
	t
}: {
	instanceId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const result = await db
		.select(
			'events.events',
			{ instance_id: instanceId, ...filter.where },
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
		.count('events.events', { instance_id: instanceId, ...filter.where })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });

	if (filter.filtered !== true) {
		await redis.set(redisString(instanceId, 'all'), parsedResult);
	}
	return parsedResult;
}

import htmlEmailRegistration from '$lib/utils/templates/email/events/event_registration_html.handlebars?raw';
import textEmailRegistration from '$lib/utils/templates/email/events/event_registration_text.handlebars?raw';
import htmlEmailReminder from '$lib/utils/templates/email/events/event_reminder_email_html.handlebars?raw';
import textEmailReminder from '$lib/utils/templates/email/events/event_reminder_email_text.handlebars?raw';
import htmlEmailFollowup from '$lib/utils/templates/email/events/event_followup_email_html.handlebars?raw';
import textEmailFollowup from '$lib/utils/templates/email/events/event_followup_email_text.handlebars?raw';
import htmlEmailCancellation from '$lib/utils/templates/email/events/event_registration_cancelled_html.handlebars?raw';
import textEmailCancellation from '$lib/utils/templates/email/events/event_registration_cancelled_text.handlebars?raw';
function returnHtmlTextEmails(type: 'registration' | 'reminder' | 'cancellation' | 'followup') {
	switch (type) {
		case 'registration':
			return { htmlEmail: htmlEmailRegistration, textEmail: textEmailRegistration };
		case 'reminder':
			return { htmlEmail: htmlEmailReminder, textEmail: textEmailReminder };
		case 'followup':
			return { htmlEmail: htmlEmailFollowup, textEmail: textEmailFollowup };
		case 'cancellation':
			return { htmlEmail: htmlEmailCancellation, textEmail: textEmailCancellation };
	}
}

async function createEventEmailNotification({
	type,
	body,
	instanceId,
	adminId,
	instance,
	defaultEmailTemplateId,
	queue,
	t
}: {
	type: 'registration' | 'reminder' | 'cancellation' | 'followup';
	body: schema.Create;
	instanceId: number;
	adminId: number;
	instance: ReadInstance;
	defaultEmailTemplateId: number;
	queue: App.Queue;
	t: App.Localization;
}): Promise<number> {
	const { htmlEmail, textEmail } = returnHtmlTextEmails(type);
	const registrationEmail = await createEmailMessage({
		instanceId,
		body: {
			name: randomUUID(),
			point_person_id: adminId,
			from: `${instance.name} <${instance.slug}@belcoda.com>`,
			reply_to: `${instance.slug}@belcoda.com`,
			subject: `${type}: ${body.heading}`,
			html: htmlEmail,
			text: textEmail,
			preview_text: `${type} confirmation for {{event.name}}`,
			use_html_for_plaintext: true,
			template_id: defaultEmailTemplateId
		},
		t,
		queue: queue,
		defaultTemplateId: defaultEmailTemplateId
	});
	return registrationEmail.id;
}

export async function selectEventsForReminderFollowupEmail(): Promise<{
	reminders: { id: number; instance_id: number; point_person_id: number }[];
	followups: { id: number; instance_id: number; point_person_id: number }[];
}> {
	const reminders = await db.sql<
		s.events.events.SQL,
		s.events.events.Selectable[]
	>`SELECT ${'id'}, ${'instance_id'}, ${'point_person_id'} FROM events.events WHERE send_reminder_email = true AND reminder_sent_at IS NULL AND starts_at < NOW() AND starts_at > NOW() - INTERVAL '1 hour' * send_reminder_hours_before_start`.run(
		pool
	);
	const followups = await db.sql<
		s.events.events.SQL,
		s.events.events.Selectable[]
	>`SELECT ${'id'}, ${'instance_id'}, ${'point_person_id'}  FROM ${'events.events'} WHERE ${'send_followup_email'} = ${db.param(true)} AND ${'followup_sent_at'} IS NULL AND ${'ends_at'} < NOW() AND ${'ends_at'} > NOW() - INTERVAL '1 hour' * ${'send_followup_hours_after_end'}`.run(
		pool
	);
	return {
		reminders,
		followups
	};
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
