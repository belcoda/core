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
	notPaged
}: {
	instance_id: number;
	url: URL;
	eventId: number;
	status: 'registered' | 'attended' | 'cancelled' | 'noshow' | 'any';
	t: App.Localization;
	notPaged?: boolean;
}): Promise<schema.List> {
	await exists({ instanceId: instance_id, eventId });
	const query = filterQuery(url, { search_key: 'search', notPaged });
	const eventWhere = status === 'any' ? {} : { status };

	const selectAttendees = await db
		.select('events.attendees', { event_id: eventId, ...eventWhere }, { columns: ['person_id'] })
		.run(pool);
	const peopleIds = selectAttendees.map((attendee) => attendee.person_id);
	const selected = await db
		.select(
			'people.people_search',
			{ id: db.conditions.isNotIn(peopleIds), instance_id: instance_id, ...query.where },
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
		.count('people.people_search', {
			id: db.conditions.isNotIn(peopleIds),
			instance_id: instance_id,
			...query.where
		})
		.run(pool);
	const parsed = parse(schema.list, { items: selected, count: count });
	return parsed;
}
