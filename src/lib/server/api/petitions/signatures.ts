import { db, pool, redis, pino, BelcodaError, filterQuery } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import * as schema from '$lib/schema/petitions/signatures';
import { exists } from '$lib/server/api/petitions/petitions';
import {
	getPersonOrCreatePersonByWhatsappId,
	exists as personExists
} from '$lib/server/api/people/people';
import type { WhatsappInboundMessage } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
import { _getInstanceByPetitionId } from '../core/instances';
import { signatureQueueMessage } from '$lib/schema/petitions/petitions';
const log = pino(import.meta.url);
function redisString(instanceId: number, petitionId: number, personId: number | 'all') {
	return `i:${instanceId}:petitions:${petitionId}:signatures:${personId}`;
}

export async function create({
	instanceId,
	petitionId,
	body,
	queue,
	t
}: {
	instanceId: number;
	petitionId: number;
	queue: App.Queue;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);

	await exists({ instanceId, petitionId });
	const notificationPayload = {
		activity_id: petitionId,
		person_id: parsed.person_id,
		event_type: 'petition',
		action: 'sign'
	};
	const existingAttendee = await db
		.selectOne('petitions.signatures', {
			person_id: parsed.person_id,
			petition_id: petitionId
		})
		.run(pool);
	if (existingAttendee) {
		log.debug(`Signature already exists for petition ${petitionId} and person ${parsed.person_id}`);
		notificationPayload.action = 'duplicate';
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { response_channel, ...dbData } = parsed;
		const result = await db
			.insert('petitions.signatures', { petition_id: petitionId, ...dbData })
			.run(pool);
		notificationPayload.person_id = result.person_id;
		notificationPayload.action = 'sign';
	}
	await redis.del(redisString(instanceId, petitionId, 'all'));
	const readResult = await read({
		instanceId,
		petitionId,
		personId: notificationPayload.person_id,
		t
	});
	await redis.set(redisString(instanceId, petitionId, notificationPayload.person_id), readResult);

	if (parsed.send_autoresponse) {
		if (parsed.response_channel === 'whatsapp') {
			await queue(
				'utils/communications/notifications/send_notification',
				instanceId,
				notificationPayload
			);
		} else {
			// Default to email
			await queue('utils/email/petitions/send_autoresponse', instanceId, {
				petition_id: petitionId,
				person_id: notificationPayload.person_id
			});
		}
	}

	return readResult;
}

export async function read({
	instanceId,
	petitionId,
	personId,
	t
}: {
	instanceId: number;
	petitionId: number;
	personId: number;
	t: App.Localization;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, petitionId, personId));
	if (cached) {
		return parse(schema.read, cached);
	}
	await exists({ instanceId, petitionId });
	const result = await db
		.selectExactlyOne('petitions.petition_signatures_view', {
			petition_id: petitionId,
			person_id: personId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PETITIONS:SIGNATURES:READ:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, petitionId, personId), parsedResult);
	return parsedResult;
}

//unsafe because it's not paginated at all
export async function unsafeListAllForEvent({
	instanceId,
	petitionId
}: {
	instanceId: number;
	petitionId: number;
}) {
	const result = await db
		.select('petitions.signatures', { petition_id: petitionId }) //no pagination
		.run(pool);
	return result;
}

export async function listForPetition({
	instanceId,
	petitionId,
	url,
	t
}: {
	instanceId: number;
	petitionId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, petitionId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	await exists({ instanceId, petitionId });
	const result = await db
		.select(
			'petitions.petition_signatures_view',
			{ petition_id: petitionId, ...filter.where },
			{
				order: { by: 'created_at', direction: 'DESC' },
				offset: filter.options.offset,
				limit: filter.options.limit
			}
		) //pagination only
		.run(pool);
	const count = await db
		.count('petitions.petition_signatures_view', { petition_id: petitionId, ...filter.where })
		.run(pool);
	log.debug(result);
	const parsedResult = parse(schema.list, { items: result, count: count });
	if (filter.filtered !== true)
		await redis.set(redisString(instanceId, petitionId, 'all'), parsedResult);
	return parsedResult;
}

// TODO: Figure out a way to make this not return signatures on deleted petitions
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
	await personExists({ instanceId, personId });
	const filter = filterQuery(url, { order_by: 'created_at' });
	const result = await db
		.select(
			'petitions.signatures',
			{ person_id: personId, ...filter.where },
			{
				order: { by: 'created_at', direction: 'DESC' },
				offset: filter.options.offset,
				limit: filter.options.limit
			}
		) //pagination only
		.run(pool);
	const count = await db
		.count('petitions.signatures', { person_id: personId, ...filter.where })
		.run(pool);
	const parsedResult = parse(schema.list, { count: count, items: result });
	return parsedResult;
}

export async function signPetition(
	petitionId: number,
	message: WhatsappInboundMessage,
	adminId: number,
	t: App.Localization,
	queue: App.Queue
) {
	const instance = await _getInstanceByPetitionId(petitionId);
	const person = await getPersonOrCreatePersonByWhatsappId(
		instance.id,
		message.from,
		message,
		queue
	);

	if (person) {
		const parsed = parse(signatureQueueMessage, {
			petition_id: Number(petitionId),
			signup: {
				full_name: message.customerProfile?.name,
				phone_number: message.from,
				country: instance.country,
				whatsapp_id: message.from,
				whatsapp_message_id: message.id,
				message: message,
				opt_in: true,
				email: null
			}
		});
		await queue('/petitions/signature', instance.id, parsed, adminId);
	}
}
