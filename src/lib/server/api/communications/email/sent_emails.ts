import { db, pool, pino, redis, filterQuery, BelcodaError, type s } from '$lib/server';
import * as schema from '$lib/schema/communications/email/sent_emails';
import { parse } from '$lib/schema/valibot';
import {
	exists as personExists,
	read as readPerson,
	redisString as personRedisString
} from '$lib/server/api/people/people';
import { type Read } from '$lib/schema/people/people';
const log = pino(import.meta.url);
function redisString(instanceId: number, personId: number) {
	return `i:${instanceId}:sent_emails:${personId}`;
}

import * as m from '$lib/paraglide/messages';

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
	const inserted = await db.insert('communications.sent_emails', parsed).run(pool);
	const parsedInserted = parse(schema.read, inserted);
	await redis.set(redisString(instanceId, parsed.person_id), parsedInserted);
	return parsedInserted;
}

export async function unsubscribeFromSentEmail({
	t,
	id
}: {
	t: App.Localization;
	id: string;
}): Promise<Read> {
	const selected = await db.selectExactlyOne('communications.sent_emails', { id }).run(pool);
	const parsedSelected = parse(schema.read, selected);
	//log.debug(parsedSelected);
	const updatedPersonSql = await db.sql<
		s.people.people.SQL,
		s.people.people.Selectable[]
	>`UPDATE people.people SET email = ${db.raw(`jsonb_set(email, '{subscribed}', 'false'::jsonb)`)} WHERE id = ${db.param(parsedSelected.person_id)} returning instance_id`;

	const updatedPerson = await updatedPersonSql.run(pool);
	if (updatedPerson.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:PEOPLE:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(personRedisString(updatedPerson[0].instance_id, parsedSelected.person_id));
	const readPersonResponse = await readPerson({
		instance_id: updatedPerson[0].instance_id,
		person_id: selected.person_id,
		t
	});
	return readPersonResponse;
}

export async function list({
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
			'communications.sent_emails',
			{ person_id: personId },
			{
				limit: query.options.limit,
				offset: query.options.offset,
				order: {
					by: 'sent_at',
					direction: 'DESC'
				}
			}
		)
		.run(pool);
	const parsedSelected = parse(schema.list, selected);
	if (!query.filtered) await redis.set(redisString(instanceId, personId), parsedSelected);
	return parsedSelected;
}
