import { filterQuery, db, pool } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/people/people';
import { exists } from '$lib/server/api/events/events';
export async function list({
	instance_id,
	url,
	eventId,
	status,
	t,
	notPaged,
	includeDeleted = false
}: {
	instance_id: number;
	url: URL;
	eventId: number;
	status: 'registered' | 'attended' | 'cancelled' | 'noshow' | 'any';
	t: App.Localization;
	notPaged?: boolean;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	await exists({ instanceId: instance_id, eventId });
	const query = filterQuery(url, { search_key: 'full_name', notPaged });
	const eventWhere = status === 'any' ? {} : { status };
	const selected = await db
		.select(
			'events.attendees',
			{ event_id: eventId, ...eventWhere },
			{
				lateral: {
					person: db.selectExactlyOne(
						'people.people',
						{
							id: db.parent('person_id'),
							instance_id: instance_id,
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
	const mapped = selected.map((row) => row.person);
	const count = await db
		.count(
			'events.attendees',
			{ event_id: eventId, ...eventWhere },
			{
				lateral: {
					person: db.selectExactlyOne('people.people', {
						id: db.parent('person_id'),
						instance_id: instance_id,
						...query.where,
						...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
					})
				}
			}
		)
		.run(pool);
	const parsed = parse(schema.list, { items: mapped, count: count });
	return parsed;
}
