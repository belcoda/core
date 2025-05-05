import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/communications/sms/received_sms';
import { parse } from '$lib/schema/valibot';
import { exists as personExists } from '$lib/server/api/people/people';

function redisString(instanceId: number, personId: number) {
	return `i:${instanceId}:received_sms:${personId}`;
}

export async function create({
	instanceId,
	body,
	t
}: {
	instanceId: number;
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	await personExists({ instanceId, personId: parsed.person_id });
	const inserted = await db.insert('communications.received_sms', parsed).run(pool);
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
			'communications.received_sms',
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
	if (!query.filtered) await redis.set(redisString(instanceId, personId), parsedSelected);
	return parsedSelected;
}
