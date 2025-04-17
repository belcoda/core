import { filterQuery, db, pool } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/people/people';
import { exists } from '$lib/server/api/people/lists';
export async function list({
	instance_id,
	url,
	listId,
	t,
	notPaged,
	includeDeleted = false
}: {
	instance_id: number;
	url: URL;
	listId: number;
	t: App.Localization;
	notPaged?: boolean;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	await exists({ instanceId: instance_id, listId });
	const query = filterQuery(url, { search_key: 'full_name', notPaged });
	const selectList = await db
		.select('people.list_people', { list_id: listId }, { columns: ['person_id'] })
		.run(pool);
	const peopleIds = selectList.map((list) => list.person_id);
	const selected = await db
		.select(
			'people.people',
			{
				instance_id,
				id: db.conditions.isNotIn(peopleIds),
				...query.where,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
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
		.run(pool);
	const count = await db
		.count('people.people', {
			id: db.conditions.isNotIn(peopleIds),
			instance_id: instance_id,
			...query.where,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool);
	const parsed = parse(schema.list, { items: selected, count: count });
	return parsed;
}
