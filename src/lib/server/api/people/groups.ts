import { BelcodaError, db, redis, pool, pino, filterQuery } from '$lib/server';
import * as m from '$lib/paraglide/messages';

import * as schema from '$lib/schema/people/groups';
import * as membersSchema from '$lib/schema/people/group_members';
import { list as listInGroup } from '$lib/server/api/people/filters/in_group';
import { parse } from '$lib/schema/valibot';
import { linkWhatsappGroup as linkWhatsappGroupWhapi } from '$lib/server/utils/whapi/groups';
function redisString(instanceId: number, groupId: number | 'all', banned?: boolean) {
	const bannedSuffix = banned ? ':banned' : '';
	return `i:${instanceId}:groups:${groupId}${bannedSuffix}`;
}

export async function exists({ instanceId, groupId }: { instanceId: number; groupId: number }) {
	const cached = await redis.get(redisString(instanceId, groupId));
	if (cached) return true;
	await db
		.selectExactlyOne('people.groups', { instance_id: instanceId, id: groupId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
	return true;
}

export async function personExists({ personId, groupId }: { personId: number; groupId: number }) {
	await db
		.selectExactlyOne('people.group_members', {
			person_id: personId,
			group_id: groupId,
			status: db.conditions.isNotIn(['banned'])
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:GROUPS:MEMBERS:EXISTS:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
}

export async function create({
	instanceId,
	adminId,
	body,
	url
}: {
	instanceId: number;
	adminId: number;
	body: schema.Create;
	url: URL;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const inserted = await db
		.insert('people.groups', { instance_id: instanceId, point_person_id: adminId, ...parsed })
		.run(pool);
	await redis.del(redisString(instanceId, 'all'));
	await redis.del(redisString(instanceId, inserted.id));
	const output = await read({ instanceId, groupId: inserted.id, url: url });
	return output;
}

export async function read({
	instanceId,
	groupId,
	url,
	banned = false
}: {
	instanceId: number;
	groupId: number;
	url: URL;
	banned?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, groupId, banned));
	if (cached) {
		return parse(schema.read, cached);
	}
	const statusCondition = banned
		? db.conditions.isIn(['banned'])
		: db.conditions.isNotIn(['banned']);
	const read = await db
		.selectExactlyOne(
			'people.groups',
			{ instance_id: instanceId, id: groupId },
			{
				lateral: {
					count: db.count('people.group_members', {
						group_id: db.parent('id'),
						status: statusCondition
					})
				}
			}
		)
		.run(pool);
	const members = await listInGroup({ instance_id: instanceId, groupId, url, banned });
	const parsed = parse(schema.read, { members: members.items, ...read });
	await redis.set(redisString(instanceId, groupId, banned), parsed);
	return parsed;
}

export async function update({
	instanceId,
	groupId,
	body,
	url
}: {
	instanceId: number;
	groupId: number;
	body: schema.Update;
	url: URL;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('people.groups', parsed, { instance_id: instanceId, id: groupId })
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, 'all'));
	await redis.del(redisString(instanceId, groupId));
	const output = await read({ instanceId, groupId: updated[0].id, url: url });
	const parsedUpdated = parse(schema.read, output);

	return parsedUpdated;
}

export async function list({
	instanceId,
	url
}: {
	instanceId: number;
	url: URL;
}): Promise<schema.List> {
	const { where, options, filtered } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const list = await db
		.select(
			'people.groups',
			{ instance_id: instanceId, ...where },
			{
				...options,
				lateral: {
					count: db.count('people.group_members', { group_id: db.parent('id') })
				}
			}
		)
		.run(pool);
	const count = await db.count('people.groups', { instance_id: instanceId, ...where }).run(pool);
	const parsed = parse(schema.list, { count: count, items: list });
	await redis.set(redisString(instanceId, 'all'), parsed);
	return parsed;
}

export async function addMember({
	instanceId,
	groupId,
	body
}: {
	instanceId: number;
	groupId: number;
	body: membersSchema.Create;
}): Promise<membersSchema.Read> {
	const parsed = parse(membersSchema.create, body);
	await exists({ instanceId, groupId });
	const inserted = await db
		.insert('people.group_members', { group_id: groupId, ...parsed })
		.run(pool);
	const parsedInserted = parse(membersSchema.read, inserted);
	await redis.del(redisString(instanceId, groupId));
	return parsedInserted;
}

export async function updateMember({
	instanceId,
	groupId,
	personId,
	body
}: {
	instanceId: number;
	groupId: number;
	personId: number;
	body: membersSchema.Update;
}): Promise<membersSchema.Read> {
	await exists({ instanceId, groupId });
	const parsed = parse(membersSchema.update, body);
	const updated = await db
		.update(
			'people.group_members',
			{ status: parsed.status },
			{ group_id: groupId, person_id: personId }
		)
		.run(pool);
	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:MEMBERS:UPDATE:01', m.pretty_tired_fly_lead());
	}
	const parsedUpdated = parse(membersSchema.read, updated[0]);
	await redis.del(redisString(instanceId, groupId));
	return parsedUpdated;
}

export async function removeMember({
	instanceId,
	groupId,
	personId
}: {
	instanceId: number;
	groupId: number;
	personId: number;
}): Promise<void> {
	await exists({ instanceId, groupId });
	const deleted = await db
		.deletes('people.group_members', { group_id: groupId, person_id: personId })
		.run(pool);
	if (deleted.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:MEMBERS:DELETE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, groupId));
}

export async function linkWhatsappGroup({
	instanceId,
	groupId,
	body,
	url
}: {
	instanceId: number;
	groupId: number;
	body: schema.LinkWhatsappGroup;
	url: URL;
}): Promise<schema.Read> {
	const parsed = parse(schema.linkWhatsappGroup, body);
	await exists({ instanceId, groupId });
	const groupWhatsappId = await linkWhatsappGroupWhapi(parsed.invitation_code);
	const updated = await update({
		instanceId,
		groupId,
		body: { whatsapp_id: groupWhatsappId },
		url
	});
	return updated;
}

export async function _getGroupByWhatsappId({
	instanceId,
	whatsappId
}: {
	instanceId: number;
	whatsappId: string;
}): Promise<schema.Read> {
	const group = await db
		.selectExactlyOne('people.groups', { instance_id: instanceId, whatsapp_id: whatsappId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:GROUPS:GET_BY_WHATSAPP_ID:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});

	return await read({ instanceId, groupId: group.id, url: new URL('http://example.com') });
}
export async function _getInstanceIdByWhatsappGroupChatId({
	whatsappId
}: {
	whatsappId: string;
}): Promise<number> {
	const group = await db
		.selectExactlyOne('people.groups', { whatsapp_id: whatsappId })
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:GROUPS:GET_BY_WHATSAPP_ID:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	return group.instance_id;
}

export async function del({
	instanceId,
	groupId
}: {
	instanceId: number;
	groupId: number;
}): Promise<void> {
	if (!(await exists({ instanceId, groupId }))) {
		throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:DELETE:01', m.pretty_tired_fly_lead());
	}
	await db
		.update('people.groups', { deleted_at: new Date() }, { instance_id: instanceId, id: groupId })
		.run(pool);
}
