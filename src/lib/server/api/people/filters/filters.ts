import { format } from 'node-pg-format';
import * as filterFunctions from '$lib/server/api/people/filters/advanced';
import {
	type FilterGroup,
	type FilterType,
	personIdsOutput
} from '$lib/schema/people/filters/filters';
import { list as listPeople, type List as ListPeople } from '$lib/schema/people/people';
import { db, pool, filterQuery, pino } from '$lib/server';
import { id, parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export function generateSqlFromFilterArray(instanceId: number, filter: FilterType): string {
	let sql = format(
		`SELECT id FROM people.people WHERE deleted_at IS NULL AND instance_id = %L AND id IN `,
		instanceId
	);

	switch (filter.type) {
		case 'address':
			sql += `${filterFunctions.address({ instanceId, searchString: filter.address })}`;
			break;
		case 'email':
			sql += `${filterFunctions.email({ instanceId, searchString: filter.email, partial: filter.partial, mustBeSubscribed: filter.mustBeSubscribed })}`;
			break;
		case 'phone_number':
			sql += `${filterFunctions.phoneNumber({ instanceId, searchString: filter.phone_number, mustBeSubscribed: filter.mustBeSubscribed, mustBeWhatsapp: filter.mustBeWhatsapp, partial: filter.partial })}`;
			break;
		case 'full_name':
			sql += ` ${filterFunctions.name({ instanceId, searchString: filter.name, partial: filter.partial })}`;
			break;
		case 'postcode':
			sql += `${filterFunctions.postcode({ instanceId, searchString: filter.postcode, partial: filter.partial })}`;
			break;
		case 'locality':
			sql += `${filterFunctions.locality({ instanceId, searchString: filter.locality, partial: filter.partial })}`;
			break;
		case 'state':
			sql += `${filterFunctions.state({ instanceId, searchString: filter.state, partial: filter.partial })}`;
			break;
		case 'in_list':
			sql += `${filterFunctions.inList({ instanceId, listId: filter.list_id })}`;
			break;
		case 'not_in_list':
			sql += `${filterFunctions.notInList({ instanceId, listId: filter.list_id })}`;
			break;
		case 'has_tag':
			sql += `${filterFunctions.hasTag({ instanceId, tagId: filter.tag_id })}`;
			break;
		case 'not_has_tag':
			sql += `${filterFunctions.notHasTag({ instanceId, tagId: filter.tag_id })}`;
			break;
		case 'registered_event':
			sql += `${filterFunctions.registeredEvent({ instanceId, eventId: filter.event_id, status: filter.status })}`;
			break;
		case 'not_registered_event':
			sql += `${filterFunctions.notRegisteredEvent({ instanceId, eventId: filter.event_id, status: filter.status })}`;
			break;
		default:
			throw new Error('Invalid filter type');
	}
	return sql;
}

export function generateSqlFromFilterGroup(instanceId: number, input: FilterGroup): string {
	let sql = format(
		`SELECT id FROM people.people WHERE deleted_at IS NULL AND instance_id = %L AND `,
		instanceId
	);
	sql += `id ${input.logic === 'NOT' ? 'NOT IN' : 'IN'} `;
	input.groups.forEach((group, i) => {
		if (i !== 0) {
			sql += ` ${input.logic} ID ${input.logic === 'NOT' ? 'NOT IN' : 'IN'} `;
		}
		sql += ` ( ${generateSqlFromFilterGroup(instanceId, group)} ) `;
	});
	if (input.filters.length > 0 && input.groups.length > 0) {
		sql += ` ${input.logic} ID ${input.logic === 'NOT' ? 'NOT IN' : 'IN'} `;
	}
	input.filters.forEach((filter, i) => {
		if (i !== 0) {
			sql += ` ${input.logic} ID ${input.logic === 'NOT' ? 'NOT IN' : 'IN'}`;
		}
		sql += ` ( ${generateSqlFromFilterArray(instanceId, filter)} ) `;
	});

	sql += ``;
	return sql;
}

export async function outputIdsFromFilterGroup(
	instanceId: number,
	input: FilterGroup
): Promise<number[]> {
	const sql = generateSqlFromFilterGroup(instanceId, input);
	log.debug(sql);
	const result = await db.sql`${db.raw(sql)}`.run(pool);
	const parsed = parse(personIdsOutput, result);
	const mapped = parsed.map((item) => item.id);
	return mapped;
}

export async function outputFilterResults(
	instanceId: number,
	input: FilterGroup,
	url: URL
): Promise<ListPeople> {
	const mapped = await outputIdsFromFilterGroup(instanceId, input);
	const { options } = filterQuery(url);
	const idConditional =
		input.logic === 'NOT' ? db.conditions.isNotIn(mapped) : db.conditions.isIn(mapped);
	const selected = await db
		.select(
			'people.people',
			{ instance_id: instanceId, id: idConditional, deleted_at: db.conditions.isNull },
			{
				...options,
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
			id: idConditional,
			instance_id: instanceId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	const parsedOutput = parse(listPeople, { items: selected, count: count });
	return parsedOutput;
}
