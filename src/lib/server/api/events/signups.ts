import { db, pool, redis, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/events/signups';
import { exists } from '$lib/server/api/events/events';
import {
	getPersonOrCreatePersonByWhatsappId,
	exists as personExists
} from '$lib/server/api/people/people';
import type { WhatsappInboundMessage } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
// import type { RequestEvent } from './$types.js';
import { _getInstanceIdByEventId } from '../core/instances';
import { signUpQueueMessage } from '$lib/schema/events/events.js';
export async function create({
	instanceId,
	eventId,
	body,
	t
}: {
	instanceId: number;
	eventId: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	await exists({ instanceId, eventId, t });
	const result = await db.insert('events.signups', { event_id: eventId, ...parsed }).run(pool);
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function update({
	instanceId,
	eventId,
	personId,
	body,
	t
}: {
	instanceId: number;
	eventId: number;
	personId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	await exists({ instanceId, eventId, t });
	const result = await db
		.update('events.signups', parsed, { event_id: eventId, person_id: personId })
		.run(pool);
	if (result.length !== 1)
		throw new BelcodaError(404, 'DATA:EVENTS:SIGNUPS:UPDATE:01', t.errors.not_found());
	const parsedResult = parse(schema.read, result);
	return parsedResult;
}

export async function listForPerson({
	instanceId,
	personId,
	t
}: {
	instanceId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.List> {
	await personExists({ instanceId, personId, t });
	const results = await db.select('events.signups', { person_id: personId }).run(pool);
	return parse(schema.list, results);
}

export async function registerPersonForEvent(
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
