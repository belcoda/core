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
	const selected = await db
		.select(
			'people.list_people',
			{ list_id: listId },
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
			'people.list_people',
			{ list_id: listId },
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
	const mapped = selected.map((row) => row.person);
	const parsed = parse(schema.list, { items: mapped, count: count });
	return parsed;
}
