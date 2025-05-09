import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/email/received_emails';
import { parse } from '$lib/schema/valibot';
import { exists as messageExists } from '$lib/server/api/communications/email/messages';
import { exists as personExists } from '$lib/server/api/people/people';

function redisString(instanceId: number, personId: number) {
	return `i:${instanceId}:received_emails:${personId}`;
}

export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	if (parsed.message_id) {
		await messageExists({ instanceId, messageId: parsed.message_id });
	}
	await personExists({ instanceId, personId: parsed.person_id });
	const inserted = await db.insert('communications.received_emails', parsed).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.del(redisString(instanceId, parsed.person_id));
	return parsedInserted;
}

export async function listForPerson({
	personId,
	instanceId,
	t,
	url
}: {
	personId: number;
	instanceId: number;
	t: App.Localization;
	url: URL;
}): Promise<schema.List> {
	const query = filterQuery(url);
	if (query.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, personId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	await personExists({ instanceId, personId });
	const selected = await db
		.select(
			'communications.received_emails',
			{ person_id: personId },
			{
				limit: query.options.limit,
				offset: query.options.offset,
				order: {
					by: 'received_at',
					direction: 'DESC'
				}
			}
		)
		.run(pool);

	const parsedSelected = parse(schema.list, selected);
	await redis.set(redisString(instanceId, personId), parsedSelected);
	return parsedSelected;
}
