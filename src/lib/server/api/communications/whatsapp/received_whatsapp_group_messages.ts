import { db, filterQuery, pool, redis } from '$lib/server';

import * as schema from '$lib/schema/communications/whatsapp/received_whatsapp_group_messages';
import { parse } from '$lib/schema/valibot';

import { exists, personExists } from '$lib/server/api/people/groups';

function redisString(instanceId: number, groupId: number) {
	return `i:${instanceId}:wagroupmsgs:${groupId}`;
}

export async function create({
	instanceId,
	groupId,
	personId,
	body,
	t
}: {
	instanceId: number;
	t: App.Localization;
	groupId: number;
	personId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	await exists({ instanceId, groupId, t });
	await personExists({ groupId, personId, t });

	const result = await db
		.insert('communications.received_whatsapp_group_messages', {
			instance_id: instanceId,
			...parsed
		})
		.run(pool);
	const parsedResult = parse(schema.read, result);
	await redis.del(redisString(instanceId, groupId));
	return parsedResult;
}

export async function list({
	instanceId,
	groupId,
	url,
	t
}: {
	instanceId: number;
	groupId: number;
	url: URL;
	t: App.Localization;
}): Promise<schema.List> {
	const { filtered, options, where } = filterQuery(url, { order_by: 'created_at' });
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, groupId));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const list = await db
		.select(
			'communications.received_whatsapp_group_messages',
			{ instance_id: instanceId, group_id: groupId, ...where },
			{
				...options,
				order: { by: 'received_at', direction: 'DESC' },
				lateral: {
					person: db.selectExactlyOne('people.people', {
						id: db.parent('person_id'),
						instance_id: instanceId
					})
				}
			}
		)
		.run(pool);
	console.log(list);
	console.log(where);
	const count = await db
		.count('communications.received_whatsapp_group_messages', {
			instance_id: instanceId,
			group_id: groupId,
			...where
		})
		.run(pool);
	const parsed = parse(schema.list, { count: count, items: list });
	if (!filtered) await redis.set(redisString(instanceId, groupId), parsed);
	return parsed;
}
