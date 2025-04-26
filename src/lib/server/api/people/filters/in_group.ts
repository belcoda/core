import { filterQuery, db, pool } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/people/people';
import * as groupSchema from '$lib/schema/people/groups';
import { exists } from '$lib/server/api/people/groups';
export async function list({
	instance_id,
	url,
	groupId,
	notPaged,
	banned = false,
	includeDeleted = false
}: {
	instance_id: number;
	url: URL;
	groupId: number;
	notPaged?: boolean;
	banned?: boolean;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	await exists({ instanceId: instance_id, groupId });
	const query = filterQuery(url, { search_key: 'full_name', notPaged });
	const statusCondition = banned
		? db.conditions.isIn(['banned'])
		: db.conditions.isNotIn(['banned']);
	const selected = await db
		.select(
			'people.group_members',
			{ group_id: groupId, status: statusCondition },
			{
				lateral: {
					person: db.selectExactlyOne(
						'people.people',
						{
							id: db.parent('person_id'),
							instance_id,
							...query.where,
							...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
						},
						{
							...query.options,
							lateral: {
								custom_fields: db.select(
									'people.custom_field_values',
									{
										person_id: db.parent('id')
									},
									{
										lateral: {
											field: db.selectExactlyOne('people.custom_fields', {
												id: db.parent('custom_field_id')
											})
										}
									}
								),
								tags: db.select(
									'people.taggings',
									{ person_id: db.parent('id') },
									{
										lateral: db.selectExactlyOne('tags', { id: db.parent('tag_id') })
									}
								),
								point_person: db.selectExactlyOne('admins', {
									id: db.parent('point_person_id')
								})
							}
						}
					)
				}
			}
		)
		.run(pool);
	const count = await db
		.count(
			'people.group_members',
			{ group_id: groupId, status: statusCondition },
			{
				lateral: {
					person: db.selectExactlyOne('people.people', {
						id: db.parent('person_id'),
						instance_id,
						...query.where,
						...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
					})
				}
			}
		)
		.run(pool);
	const mapped = selected.map((row) => {
		return { status: row.status, ...row.person };
	});
	const listOfPeople = parse(groupSchema.read.entries.members, mapped);
	const parsed = { items: listOfPeople, count: count };
	return parsed;
}
