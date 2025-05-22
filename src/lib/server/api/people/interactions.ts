import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import {
	create as createSchema,
	type Create,
	type List,
	type Read,
	list as listSchema,
	read as readSchema
} from '$lib/schema/people/interactions';
import * as m from '$lib/paraglide/messages';
import { filterInteractions } from '$lib/server/utils/filters/filter';
import { parse } from '$lib/schema/valibot';
import {
	exists as personExists,
	redisString as personRedisString
} from '$lib/server/api/people/people';
import { exists as adminExists } from '$lib/server/api/core/admins';

import { queue } from '$lib/server/api/people/interactions/queue';
export { queue };
function redisString(
	instance_id: number,
	person_id: number,
	type?: 'communications' | 'activity' | null
) {
	return `i:${instance_id}:interactions:${person_id}${type ? `:${type}` : ''}`;
}

export async function list({
	instanceId,
	personId,
	url,
	type = null
}: {
	instanceId: number;
	personId: number;
	url: URL;
	type?: 'communications' | 'activity' | null;
}): Promise<List> {
	const { filtered, where, options } = filterQuery(url);
	// if (!filtered) {
	// 	const cached = await redis.get(redisString(instanceId, personId, type));
	// 	if (cached) {
	// 		return parse(listSchema, cached);
	// 	}
	// }
	//either it's activity, or conditions or simply just not null...
	const typeConditions = filterInteractions(url);
	const interactions = await db
		.select(
			'people.list_interactions',
			{ instance_id: instanceId, type: typeConditions, person_id: personId, ...where },
			{
				order: { by: 'created_at', direction: 'DESC' },
				offset: options.offset,
				limit: options.limit,
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('admin_id') })
				}
			}
		)
		.run(pool);
	const count = await db
		.count('people.list_interactions', { type: typeConditions, person_id: personId, ...where })
		.run(pool);
	const parsed = parse(listSchema, { items: interactions, count: count });
	await redis.set(redisString(instanceId, personId, type), parsed);
	return parsed;
}

export async function create({
	instanceId,
	body,
	t
}: {
	instanceId: number;
	body: Create;
	t: App.Localization;
}): Promise<Read> {
	const parsed = parse(createSchema, body);
	await personExists({ instanceId, personId: parsed.person_id });
	await adminExists({ instanceId, adminId: parsed.admin_id, t });
	const result = await db
		.insert('people.interactions', { instance_id: instanceId, ...parsed })
		.run(pool);
	const output = await db
		.selectExactlyOne(
			'people.interactions',
			{ id: result.id },
			{
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('admin_id') })
				}
			}
		)
		.run(pool);
	const parsedOut = parse(listSchema.entries.items.item, output);
	await redis.del(personRedisString(instanceId, parsed.person_id));
	await redis.del(redisString(instanceId, parsed.person_id));
	return parsedOut;
}

export async function read({
	instanceId,
	personId,
	interactionId
}: {
	instanceId: number;
	personId: number;
	interactionId: number;
}): Promise<Read> {
	const output = await db
		.selectExactlyOne(
			'people.interactions',
			{ id: interactionId, instance_id: instanceId, person_id: personId },
			{
				lateral: {
					admin: db.selectExactlyOne('admins', { id: db.parent('admin_id') })
				}
			}
		)
		.run(pool);
	const parsedOut = parse(readSchema, output);
	return parsedOut;
}

export async function updateNotes({
	instanceId,
	personId,
	interactionId,
	adminId,
	notes,
	t
}: {
	instanceId: number;
	personId: number;
	interactionId: number;
	adminId: number;
	notes: string;
	t: App.Localization;
}): Promise<Read> {
	const interaction = await read({ instanceId, personId, interactionId });
	const newDetails = moveNoteToEditHistory({
		newNote: notes,
		adminId,
		previousNote: interaction.details,
		t
	});

	await db
		.update(
			'people.interactions',
			{ details: newDetails },
			{ id: interactionId, instance_id: instanceId }
		)
		.run(pool);
	await redis.del(personRedisString(instanceId, personId));
	await redis.del(redisString(instanceId, personId));
	return await read({ instanceId, personId, interactionId });
}

/**
 * Updates a note with new content, and appends the edit history with the old note content
 * @param {string} newNote - The new note to be updated
 * @param {int} adminId - The id of the admin who is updating the note
 * @param {Object} previousNote - The previous note that is being updated
 * @param {Object} t - The localization object
 * @returns {Object} - The new note details
 */
export function moveNoteToEditHistory({
	newNote,
	adminId,
	previousNote,
	t
}: {
	newNote: string;
	adminId: number;
	previousNote: Read['details'];
	t: App.Localization;
}) {
	if (previousNote.type !== 'notes') {
		throw new BelcodaError(
			400,
			'API:/people/interactions/moveNoteToEditHistory:01',
			m.basic_slimy_reindeer_treat()
		);
	}
	const newNoteDetils: Read['details'] = {
		type: 'notes',
		notes: newNote,
		edit_history: [
			...previousNote.edit_history,
			{
				edited_at: new Date(),
				edited_by: adminId,
				prior_state: previousNote.notes
			}
		]
	};
	return newNoteDetils;
}
