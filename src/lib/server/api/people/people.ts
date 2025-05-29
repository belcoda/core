import { db, pool, redis, pino, BelcodaError, error, filterQuery, type s } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { format } from 'node-pg-format';
import * as schema from '$lib/schema/people/people';
import { read as instanceApi } from '$lib/server/api/core/instances';
import { filterPersonTags } from '$lib/server/utils/filters/filter';
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from '$lib/i18n';
import { queue as queueInteraction } from '$lib/server/api/people/interactions/queue.js';
import { getUniqueKeys } from '$lib/utils/objects/get_unique_keys';
import { parse, v, mediumString, longString } from '$lib/schema/valibot';
import { whatsappNumberForVerification } from '$lib/schema/people/channels/channels';
import type { WhatsappInboundMessage } from '$lib/schema/communications/whatsapp/webhooks/ycloud';

export const redisString = (instance_id: number, person_id: number | 'all') =>
	`i:${instance_id}:people:${person_id}`;

const log = pino(import.meta.url);

async function queueCustomFieldSet({
	objectSchema,
	body,
	instance_id,
	admin_id,
	person_id,
	queue
}: {
	objectSchema: typeof schema.create | typeof schema.update;
	body: schema.Create | schema.Update;
	instance_id: number;
	admin_id?: number | undefined;
	person_id: number;
	queue: App.Queue;
}) {
	const all_fields = v.parse(v.looseObject({ ...objectSchema.entries }), body); //gets all fields...
	const parsed = v.parse(objectSchema, body);
	const uniqueKeys = getUniqueKeys(all_fields, parsed);
	const customFieldRecord = v.record(mediumString, longString);
	const customFields = v.parse(customFieldRecord, uniqueKeys);
	const promiseArr = [];
	for (const field in customFields) {
		const value = customFields[field];
		promiseArr.push(
			queue(
				'core/people/custom_fields/set_custom_field',
				instance_id,
				{
					person_id: person_id,
					field: field,
					value: value
				},
				admin_id
			)
		);
	}
	await Promise.all(promiseArr);
}

type CreateOptions = {
	petitionId?: number;
	petitionName?: string;
	eventId?: number;
	eventName?: string;
};

export async function create({
	instance_id,
	admin_id,
	body,
	queue,
	method,
	options
}: {
	instance_id: number;
	admin_id?: number;
	body: schema.Create;
	queue: App.Queue;
	method: 'manual' | 'import' | 'event_registration' | 'petition_signature';
	options?: CreateOptions;
}) {
	const parsed = v.parse(v.looseObject({ ...schema.create.entries }), body); //because we want to allow custom fields to be passed through to the function
	//const parsed = parse(schema.create, body);
	const point_person_id =
		parsed.point_person_id ||
		admin_id ||
		(await instanceApi({ instance_id })).settings.default_admin_id;
	const toInsert = {
		instance_id,
		point_person_id: point_person_id,
		preferred_language: parsed.preferred_language || DEFAULT_LANGUAGE,
		...parsed,
		dob: (parsed.dob as `${number}-${number}-${number}`) || null,
		country: parsed.country || DEFAULT_COUNTRY
	};
	const inserted = await db.insert('people.people', toInsert).run(pool);

	//now we want to add the custom fields that might be included...
	await queueCustomFieldSet({
		objectSchema: schema.create,
		body,
		instance_id,
		admin_id,
		person_id: inserted.id,
		queue: queue
	});
	if (inserted.phone_number?.phone_number) {
		const personToUpdate = parse(whatsappNumberForVerification, { person_id: inserted.id });
		await queue('/whatsapp/whapi/check_phone_number', instance_id, personToUpdate, admin_id);
	}
	await redis.del(redisString(instance_id, 'all'));
	const person = await read({ instance_id, person_id: inserted.id });

	switch (method) {
		case 'petition_signature': {
			if (options?.petitionId && options?.petitionName) {
				await queueInteraction({
					personId: person.id,
					adminId: point_person_id,
					instanceId: instance_id,
					details: {
						type: 'person_joined',
						details: {
							method: 'petition_signature',
							petition_id: options.petitionId,
							petition_name: options.petitionName
						}
					},
					queue: queue
				});
				//break is inside the if conditional because we DO want it fall through to the default case if we don't have the petitionId and petitionName
				break;
			}
		}
		case 'event_registration': {
			if (options?.eventId && options.eventName) {
				await queueInteraction({
					personId: person.id,
					adminId: point_person_id,
					instanceId: instance_id,
					details: {
						type: 'person_joined',
						details: {
							method: 'event_registration',
							event_id: options.eventId,
							event_name: options.eventName
						}
					},
					queue: queue
				});
				//break is inside the if conditional because we DO want it fall through to the default case if we don't have the petitionId and petitionName
				break;
			}
		}
		case 'import': {
			await queueInteraction({
				personId: person.id,
				adminId: point_person_id,
				instanceId: instance_id,
				details: {
					type: 'person_added',
					details: { method: 'import' }
				},
				queue: queue
			});
			break;
		}
		default: {
			await queueInteraction({
				personId: person.id,
				adminId: point_person_id,
				instanceId: instance_id,
				details: {
					type: 'person_added',
					details: { method: 'manual' }
				},
				queue: queue
			});
		}
	}

	return person;
}

type UpdateOptions = {
	skipCustomFieldsQueue?: boolean;
	skipWhatsappCheck?: boolean;
};

export async function update({
	instance_id,
	person_id,
	body,
	admin_id,
	queue,
	options
}: {
	instance_id: number;
	person_id: number;
	admin_id: number;
	body: schema.Update;
	queue: App.Queue;
	options?: UpdateOptions;
}) {
	try {
		const parsed = parse(schema.update, body);
		//fix type issue in date format (needs to be YYYY-MM-DD)
		const toUpdate = {
			...parsed,
			...(parsed.dob ? { dob: parsed.dob as `${number}-${number}-${number}` } : {})
		};
		const updated = await db
			.update(
				'people.people',
				//@ts-ignore (this is an issue with passing a string where the db expects `${number}-${number}-${number}` for an ISO date. But we have already validated it as an iso date, and tried to typecase it above. Not sure what's going on here)
				{ ...toUpdate },
				{ instance_id, id: person_id, deleted_at: db.conditions.isNull }
			)
			.run(pool)
			.catch((err) => {
				throw new BelcodaError(
					404,
					'DATA:PEOPLE:PEOPLE:UPDATE:01',
					m.basic_slimy_reindeer_treat(),
					err
				);
			});

		if (updated.length !== 1)
			throw new BelcodaError(404, 'DATA:PEOPLE:PEOPLE:UPDATE:01', m.that_tasty_dove_pop());

		if (options?.skipCustomFieldsQueue !== true) {
			await queueCustomFieldSet({
				objectSchema: schema.update,
				body,
				instance_id,
				admin_id,
				person_id: updated[0].id,
				queue: queue
			});
		}
		if (options?.skipWhatsappCheck !== true) {
			const cachedPerson = await redis.get(redisString(instance_id, updated[0].id));
			console.log('cachedPerson', cachedPerson);
			if (cachedPerson) {
				const cachedPersonParsed = parse(schema.read, cachedPerson);
				if (
					cachedPersonParsed.phone_number?.phone_number !== updated[0].phone_number?.phone_number
				) {
					const personToUpdate = parse(whatsappNumberForVerification, { person_id: updated[0].id });
					await queue('/whatsapp/whapi/check_phone_number', instance_id, personToUpdate, admin_id);
				}
			}
		}
		await redis.del(redisString(instance_id, person_id));
		await redis.del(redisString(instance_id, 'all'));
		const person = await read({ instance_id, person_id: updated[0].id });
		return person;
	} catch (err) {
		console.log('Update person error:', { error: err, body });
		throw err;
	}
}

export async function read({
	instance_id,
	person_id,
	url,
	includeDeleted = false
}: {
	instance_id: number;
	person_id: number;
	url?: URL;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instance_id, person_id));
	if (cached) {
		const parsed = v.parse(schema.read, cached);
		if (!includeDeleted && parsed.deleted_at) {
			return error(404, 'DATA:PEOPLE:PEOPLE:READ:01', m.pretty_tired_fly_lead());
		}
		return parsed;
	}
	const person = await db
		.selectExactlyOne(
			'people.people',
			{
				instance_id,
				id: person_id,
				...(!includeDeleted && { deleted_at: db.conditions.isNull })
			},
			{
				lateral: {
					custom_fields: db.select(
						'people.custom_field_values',
						{
							person_id: person_id
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
						{ person_id: person_id },
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
		.run(pool)
		.catch((err) => {
			return error(404, 'DATA:PEOPLE:PEOPLE:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsed = v.parse(schema.read, person);
	await redis.set(redisString(instance_id, person_id), parsed);
	return parsed;
}

export async function getIdsFromEmailPhoneNumber({
	instanceId,
	email,
	phoneNumber,
	includeDeleted = false
}: {
	instanceId: number;
	email?: string | null;
	phoneNumber?: string | null;
	includeDeleted?: boolean;
}): Promise<number[]> {
	log.debug('getIdsFromEmailPhoneNumber');
	const peopleIds = await db.sql<s.people.people.SQL, s.people.people.Selectable[]>`
	SELECT id FROM ${'people.people'} WHERE (email->>'email' = ${db.param(email)} OR phone_number->>'phone_number' = ${db.param(phoneNumber)}) AND ${'instance_id'} = ${db.param(instanceId)} ${includeDeleted ? db.sql`` : db.sql`AND deleted_at IS NULL`}`.run(
		pool
	);
	const ids = peopleIds.map((f) => f.id);
	log.debug('getIdsFromEmailPhoneNumber done');
	return ids;
}

export async function list({
	instance_id,
	url,
	notPaged,
	includeDeleted = false
}: {
	instance_id: number;
	url: URL;
	notPaged?: boolean;
	includeDeleted?: boolean;
}): Promise<schema.List | schema._ListWithSearch> {
	const query = filterQuery(url, {
		search_key: 'search',
		notPaged
	});

	// Add deleted_at condition if not including deleted records
	if (!includeDeleted) {
		query.where = { ...query.where, deleted_at: db.conditions.isNull };
	}

	if (query.filtered === false && !includeDeleted) {
		// Deleted records are not included in the cache
		const cached = await redis.get(redisString(instance_id, 'all'));
		if (cached) {
			return v.parse(schema.list, cached);
		}
	}
	const tagIds = filterPersonTags(url);
	let personIds: number[] = [];
	for (const tagId of tagIds) {
		const people = await db
			.select('people.taggings', { tag_id: tagId }, { columns: ['person_id'] })
			.run(pool);
		if (personIds.length === 0) {
			personIds.push(...people.map((f) => f.person_id));
		} else {
			personIds = personIds.filter((id) => people.some((item) => item.person_id === id));
		}
		// Early exit if no matching personIds remain. Why waste our time?
		if (personIds.length === 0) {
			break;
		}
	}
	const checkTags = tagIds.length > 0 ? { id: db.conditions.isIn(personIds) } : {}; //can't be personIds length, because then it won't apply the condition when there are zero results
	const selected = await db
		.select(
			'people.people_search',
			{ instance_id: instance_id, ...checkTags, ...query.where },
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
		.run(pool);
	const count = await db
		.count('people.people_search', { instance_id: instance_id, ...query.where })
		.run(pool);
	if (url.searchParams.get('_withSearch')) {
		const parsed = parse(schema._listWithSearch, { count: count, items: selected });
		return parsed;
	} else {
		const parsed = parse(schema.list, { count: count, items: selected });
		return parsed;
	}
}

export async function exists({
	instanceId,
	personId
}: {
	instanceId: number;
	personId: number;
}): Promise<true> {
	const cached = await redis.get(redisString(instanceId, personId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('people.people', {
			instance_id: instanceId,
			id: personId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:PEOPLE:EXISTS:01',
				m.every_formal_jellyfish_stop(),
				err
			);
		});
	//will throw an error if it doesn't exist...
	return true;
}

export async function _updateWhatsappId({
	instanceId,
	personId,
	whatsappId
}: {
	instanceId: number;
	personId: number;
	whatsappId: string;
}): Promise<true> {
	log.debug('_updateWhatsappId');
	const sql = format(
		`UPDATE people.people SET "phone_number" = jsonb_set("phone_number", '{whatsapp_id}', %L) WHERE id = %L AND instance_id = %L AND deleted_at IS NULL`,
		`"${whatsappId}"`,
		personId,
		instanceId
	);
	await db.sql`${db.raw(sql)}`.run(pool);
	await redis.del(redisString(instanceId, personId));
	await redis.del(redisString(instanceId, 'all'));
	log.debug('_updateWhatsappId done');
	return true;
}
import { parsePhoneNumber } from 'awesome-phonenumber';

export async function _getPersonByWhatsappId({
	instanceId,
	whatsappId
}: {
	instanceId: number;
	whatsappId: string;
}): Promise<schema.Read> {
	const phoneNumber = parsePhoneNumber(whatsappId);
	const parsedPhoneNumber = phoneNumber.valid ? phoneNumber.number.e164 : whatsappId;
	const whapiId = `${whatsappId}@s.whatsapp.net`;
	log.debug('_getPersonByWhatsappId');
	log.debug(whatsappId);
	log.debug('phoneNumber.number.e164');
	log.debug(parsedPhoneNumber);
	const person =
		await db.sql`SELECT id FROM ${'people.people'} WHERE (phone_number->>'whatsapp_id' = ${db.param(parsedPhoneNumber)} OR phone_number->>'phone_number' = ${db.param(parsedPhoneNumber)} OR phone_number ->>'whapi_id' = ${db.param(whapiId)}) AND instance_id = ${db.param(instanceId)} AND deleted_at IS NULL LIMIT 1`.run(
			pool
		);
	log.info(whatsappId);
	if (person.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:PEOPLE:PEOPLE:GET_PERSON_BY_WHATSAPP_ID:01',
			m.every_formal_jellyfish_stop()
		);
	}
	log.debug('_getPersonByWhatsappId done: ', person);
	return await read({ instance_id: instanceId, person_id: person[0].id });
}

export async function _createPersonByWhatsappId({
	instanceId,
	whatsappId,
	name,
	queue
}: {
	instanceId: number;
	whatsappId: string;
	name: string;
	queue: App.Queue;
}) {
	return await create({
		instance_id: instanceId,
		body: {
			full_name: name,
			phone_number: {
				phone_number: whatsappId,
				whatsapp_id: whatsappId,
				country: DEFAULT_COUNTRY, // TODO: Get country from phone number country code
				contactable: true,
				subscribed: true,
				textable: true,
				strict: false,
				validated: false,
				whapi_id: null,
				whatsapp: true
			},
			dob: null,
			country: DEFAULT_COUNTRY // TODO: Get country from phone number country code
		},
		method: 'event_registration',
		queue
	});
}

export async function _getInstanceIdByPersonId({
	personId
}: {
	personId: number;
}): Promise<number> {
	const response = await db
		.selectExactlyOne(
			'people.people',
			{ id: personId, deleted_at: db.conditions.isNull },
			{ columns: ['instance_id'] }
		)
		.run(pool);
	return response.instance_id;
}

export async function del({
	instance_id,
	person_id,
	admin_id,
	queue
}: {
	instance_id: number;
	person_id: number;
	admin_id: number;
	queue: App.Queue;
}): Promise<true> {
	// Check if person exists and is not already deleted
	await read({ instance_id, person_id });

	const updated = await db
		.update(
			'people.people',
			{ deleted_at: new Date() },
			{
				instance_id,
				id: person_id
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:PEOPLE:DELETE:01', m.pretty_tired_fly_lead(), err);
		});

	if (updated.length !== 1) {
		throw new BelcodaError(404, 'DATA:PEOPLE:PEOPLE:DELETE:01', m.pretty_tired_fly_lead());
	}

	// Clear cache
	await redis.del(redisString(instance_id, person_id));
	await redis.del(redisString(instance_id, 'all'));

	// Queue interaction for deletion
	await queueInteraction({
		personId: person_id,
		adminId: admin_id,
		instanceId: instance_id,
		details: { type: 'person_deleted', person_id: person_id },
		queue
	});

	return true;
}

export async function getPersonOrCreatePersonByWhatsappId(
	instanceId: number,
	whatsappId: string,
	message: WhatsappInboundMessage,
	queue: App.Queue
) {
	try {
		return await _getPersonByWhatsappId({
			instanceId,
			whatsappId
		});
	} catch (err) {
		if (err instanceof BelcodaError && err.code === 404) {
			log.debug('Person not found by whatsappId. Creating person');
			return await _createPersonByWhatsappId({
				instanceId,
				whatsappId,
				name: message.customerProfile?.name,
				queue
			});
		} else {
			throw err;
		}
	}
}

export async function _getPersonByEmail({
	instanceId,
	email,
	t
}: {
	instanceId: number;
	email: string;
	t: App.Localization;
}): Promise<schema.Read> {
	const person =
		await db.sql`SELECT id FROM ${'people.people'} WHERE (email->>'email' = ${db.param(email)}) AND instance_id = ${db.param(instanceId)} AND deleted_at IS NULL LIMIT 1`.run(
			pool
		);
	if (person.length !== 1) {
		throw new BelcodaError(
			404,
			'DATA:PEOPLE:PEOPLE:GET_PERSON_BY_EMAIL:01',
			m.every_formal_jellyfish_stop()
		);
	}
	return await read({ instance_id: instanceId, person_id: person[0].id });
}
