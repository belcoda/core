import { db, pool, redis, pino, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/events/attendees';
import { exists } from '$lib/server/api/events/events';

import {
	getPersonOrCreatePersonByWhatsappId,
	exists as personExists
} from '$lib/server/api/people/people';
import type { WhatsappInboundMessage } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
// import type { RequestEvent } from './$types.js';
import { _getInstanceIdByEventId } from '../core/instances';
import { signUpQueueMessage } from '$lib/schema/events/events.js';

const log = pino(import.meta.url);

function redisString(instanceId: number, eventId: number, personId: number | 'all') {
	return `i:${instanceId}:events:${eventId}:attendees:${personId}`;
}

export async function create({
	instanceId,
	eventId,
	body,
	queue,
	t
}: {
	instanceId: number;
	eventId: number;
	queue: App.Queue;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);

	await exists({ instanceId, eventId, t });
	const result = await db.insert('events.attendees', { event_id: eventId, ...parsed }).run(pool);
	await redis.del(redisString(instanceId, eventId, 'all'));
	const readResult = await read({ instanceId, eventId, personId: result.person_id, t });
	await redis.set(redisString(instanceId, eventId, result.person_id), readResult);

	if (parsed.send_notifications) {
		await queue('utils/email/events/send_registration_email', instanceId, {
			event_id: eventId,
			person_id: result.person_id
		});
	}

	return readResult;
}

export async function read({
	instanceId,
	eventId,
	personId,
	t
}: {
	instanceId: number;
	eventId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, eventId, personId));
	if (cached) {
		return parse(schema.read, cached);
	}
	await exists({ instanceId, eventId, t });
	const result = await db
		.selectExactlyOne('events.event_attendees_view', { event_id: eventId, person_id: personId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:ATTENDEES:READ:01', t.errors.not_found(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, eventId, personId), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	eventId,
	personId,
	body,
	queue,
	t
}: {
	instanceId: number;
	eventId: number;
	personId: number;
	body: schema.Update;
	queue: App.Queue;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	await exists({ instanceId, eventId, t });
	await db.update('events.attendees', parsed, { event_id: eventId, person_id: personId }).run(pool);
	await redis.del(redisString(instanceId, eventId, 'all'));
	await redis.del(redisString(instanceId, eventId, personId));
	const readResult = await read({ instanceId, eventId, personId, t });
	await redis.set(redisString(instanceId, eventId, personId), readResult);

	if (readResult.send_notifications) {
		if (readResult.status === 'registered') {
			await queue('utils/email/events/send_registration_email', instanceId, {
				event_id: eventId,
				person_id: readResult.person_id
			});
		}
		if (readResult.status === 'cancelled') {
			await queue('utils/email/events/send_cancellation_email', instanceId, {
				event_id: eventId,
				person_id: readResult.person_id
			});
		}
	}

	return readResult;
}

//unsafe because it's not paginated at all
export async function unsafeListAllForEvent({
	instanceId,
	eventId
}: {
	instanceId: number;
	eventId: number;
}) {
	const result = await db
		.select('events.event_attendees_view', { event_id: eventId }) //no pagination
		.run(pool);
	const parsedResult = parse(schema.list.entries.items, result);
	return parsedResult;
}

export async function listForEvent({
	instanceId,
	eventId,
	url,
	t
}: {
	instanceId: number;
	eventId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, eventId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	await exists({ instanceId, eventId, t });
	const result = await db
		.select('events.event_attendees_view', { event_id: eventId, ...filter.where }, filter.options) //pagination only
		.run(pool);
	const count = await db
		.count('events.event_attendees_view', { event_id: eventId, ...filter.where })
		.run(pool);
	log.debug(result);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (filter.filtered !== true)
		await redis.set(redisString(instanceId, eventId, 'all'), parsedResult);
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
	await personExists({ instanceId, personId, t });
	const filter = filterQuery(url);
	const result = await db
		.select('events.attendees', { person_id: personId, ...filter.where }, filter.options) //pagination only
		.run(pool);
	const count = await db
		.count('events.attendees', { person_id: personId, ...filter.where })
		.run(pool);
	const parsedResult = parse(schema.list, { count: count, items: result });
	return parsedResult;
}

export async function registerPersonForEventFromWhatsApp(
	eventId: string,
	message: WhatsappInboundMessage,
	adminId: number,
	t: App.Localization,
	queue: App.Queue
) {
	const instance = await _getInstanceIdByEventId(eventId);
	const person = await getPersonOrCreatePersonByWhatsappId(
		instance.id,
		message.from,
		message,
		t,
		queue
	);

	if (person) {
		// Send to events/registration queue
		const parsed = parse(signUpQueueMessage, {
			event_id: Number(eventId),
			signup: {
				full_name: message.customerProfile?.name,
				phone_number: message.from,
				country: instance.country,
				email: null,
				opt_in: true
			}
		});
		await queue('/events/registration', instance.id, parsed, adminId);
	}
}
