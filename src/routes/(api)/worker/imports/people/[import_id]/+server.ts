import { json, error, BelcodaError, pino } from '$lib/server';
import { getCsvFromBucket } from '$lib/server/utils/s3/put';
import { PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME } from '$env/static/public';
import { update } from '$lib/server/api/people/imports';
import { type SupportedCountry, SUPPORTED_COUNTRIES } from '$lib/i18n/index.js';
import * as csv from 'fast-csv';
import { create as createPerson } from '$lib/server/api/people/people';
import { create as createSchema } from '$lib/schema/people/people';
import { renderName } from '$lib/utils/text/names';
import { v, parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import { getCsvFromLocalFolderAsync } from '$lib/utils/testing/csv_reader.js';
const log = pino(import.meta.url);

export async function POST(event) {
	try {
		//parse Schema must be defined here because it uses local values from event.locals
		const parseSchema = v.pipe(
			v.object({
				family_name: v.nullable(v.string()),
				given_name: v.nullable(v.string()),
				email: v.nullable(v.string()),
				email_subscribed: v.optional(v.string(), 'true'),
				phone_number: v.nullable(v.string()),
				phone_subscribed: v.optional(v.string(), 'true'),
				address_line_1: v.nullable(v.string()),
				address_line_2: v.nullable(v.string()),
				city: v.nullable(v.string()),
				postcode: v.nullable(v.string()),
				state: v.nullable(v.string()),
				country: v.nullable(
					v.pipe(
						v.string(),
						v.transform((input) => {
							if (!input || input.trim() === '') return event.locals.instance.country;

							const normalized = input.toLowerCase().trim();

							// If it's already a valid 2-letter ISO code
							if (
								normalized.length === 2 &&
								SUPPORTED_COUNTRIES.includes(normalized.toUpperCase() as SupportedCountry)
							) {
								return normalized.toUpperCase();
							}

							// Default to instance country if no match found
							return event.locals.instance.country;
						})
					)
				),
				organization: v.nullable(v.string()),
				position: v.nullable(v.string()),
				gender: v.nullable(
					v.pipe(
						v.string(),
						v.transform((input) => {
							if (!input) return null;
							const normalized = input.toLowerCase().trim();
							switch (normalized) {
								case 'male':
								case 'm':
									return 'male';
								case 'female':
								case 'f':
									return 'female';
								case 'other':
									return 'other';
								case 'not_specified':
									return 'not_specified';
								default:
									return 'not_specified';
							}
						}),
						v.picklist(['male', 'female', 'other', 'not_specified'])
					)
				),
				date_of_birth: v.nullable(v.string()),
				preferred_language: v.nullable(
					v.pipe(
						v.string(),
						v.transform((input) => {
							if (!input) return null;
							const trimmed = input.trim();
							// Check if it's a valid 2-letter code (letters only)
							if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) {
								return trimmed.toLowerCase();
							}
							// Default to instance language if invalid
							return event.locals.instance.language;
						})
					)
				),
				tags: v.optional(v.nullable(v.string()), null),
				events: v.optional(v.nullable(v.string()), null)
			}),
			v.transform((input) => {
				const hasPhoneNumber = input.phone_number && input.phone_number.length > 0;
				const hasEmail = input.email && input.email.length > 0;
				//this has casting, but it's tested against the SUPPORTED_COUNTRIES array.
				const inputCountry = SUPPORTED_COUNTRIES.includes(input.country as SupportedCountry)
					? (input.country as SupportedCountry)
					: event.locals.instance.country;

				function filterEmpty(value: string[]) {
					return value.filter((v) => {
						return v;
					});
				}

				const filteredTags = input.tags ? filterEmpty(input.tags.split(',')) : [];
				const filteredEvents = input.events ? filterEmpty(input.events.split(',')) : [];

				return {
					family_name: input.family_name,
					given_name: input.given_name,
					full_name: renderName(input, inputCountry),
					email: !hasEmail
						? null
						: {
								email: input.email,
								subscribed: input.email_subscribed === 'true'
							},
					phone_number: !hasPhoneNumber
						? null
						: {
								phone_number: input.phone_number,
								subscribed: input.phone_subscribed === 'true',
								country: input.country || event.locals.instance.country,
								strict: false
							},
					address_line_1: input.address_line_1,
					address_line_2: input.address_line_2,
					locality: input.city,
					postcode: input.postcode,
					state: input.state,
					country: inputCountry,
					organization: input.organization,
					position: input.position,
					preferred_language: input.preferred_language,
					gender: input.gender,
					dob:
						!input.date_of_birth || input.date_of_birth.trim() === ''
							? null
							: /^\d{4}-\d{2}-\d{2}$/.test(input.date_of_birth)
								? input.date_of_birth
								: null,
					tags: filteredTags,
					events: filteredEvents
				};
			})
		);

		const importId = Number(event.params.import_id);
		const item = await update({
			instanceId: event.locals.instance.id,
			importId,
			t: event.locals.t,
			body: { status: 'processing' }
		});
		const url = new URL(item.csv_url);
		const itemKey = decodeURIComponent(url.pathname.slice(1));
		const resultText = await getCsvFromBucket(PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME, itemKey);
		if (!resultText)
			throw new BelcodaError(
				500,
				'API:/api/v1/worker/imports/people/[import_id]:POST:02',
				'No data found in the file'
			);
		const records: unknown[] = [];
		csv
			.parseString(resultText, { headers: true })
			.on('error', function (err) {
				log.error(err);
			})
			.on('data', function (row) {
				// Check if all values in the row are empty or null
				const isEntirelyEmptyRow = Object.values(row).every(
					(value) => value === null || String(value).trim() === ''
				);

				// Check if both family_name and given_name are empty
				const familyName = row.family_name ? String(row.family_name).trim() : '';
				const givenName = row.given_name ? String(row.given_name).trim() : '';
				const isNameEmpty = familyName === '' && givenName === '';

				if (!isEntirelyEmptyRow && !isNameEmpty) {
					records.push(row);
				}
			})
			.on('end', async function (rowCount: number) {
				log.debug(`Parsed ${rowCount} rows`);
				let successCount = 0;
				let failedCount = 0;

				for (let i = 0; i < records.length; i++) {
					const parsed = parse(parseSchema, records[i]);
					log.debug(parsed);
					try {
						//todo: transform phoneNumber, etc into the budgets and add them to the created entries
						const parsedItem = v.parse(v.looseObject({ ...createSchema.entries }), parsed); //because we want to allow custom fields to be passed through to the function
						const { events, tags, ...strippedPerson } = parsedItem; //remove events and tags from the person object
						const createdPerson = await createPerson({
							instance_id: event.locals.instance.id,
							admin_id: event.locals.admin.id,
							body: parsedItem,
							queue: event.locals.queue,
							method: 'import'
						});
						for (const tag of parsed.tags) {
							await addPersonToTag({
								instanceId: event.locals.instance.id,
								personId: createdPerson.id,
								tagName: tag,
								t: event.locals.t
							});
						}
						for (const eventSlug of parsed.events) {
							await addPersonToEvent({
								instanceId: event.locals.instance.id,
								personId: createdPerson.id,
								eventSlug,
								t: event.locals.t,
								queue: event.locals.queue,
								importId
							});
						}
						successCount++;
					} catch (err) {
						log.error(err);
						failedCount++;
					}
				}

				//await update the import record with the success and failed count and the status
				await update({
					instanceId: event.locals.instance.id,
					importId,
					t: event.locals.t,
					body: {
						status: 'complete',
						total_rows: records.length,
						processed_rows: successCount,
						failed_rows: failedCount
					}
				});
			});

		return json(records);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/worker/imports/people/[import_id]:POST:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

import { readByName, create as createTag } from '$lib/server/api/core/tags';
import { create as createTagging } from '$lib/server/api/people/taggings';
async function addPersonToTag({
	instanceId,
	personId,
	tagName,
	t
}: {
	instanceId: number;
	personId: number;
	tagName: string;
	t: App.Localization;
}): Promise<void> {
	try {
		//try to add them to an existing tag
		const tag = await readByName({ instanceId, tagName });
		await createTagging({ instanceId, personId, tagId: tag.id, t });
		log.debug({ instanceId, personId, tagName }, 'Added tag');
	} catch (err) {
		//if no tag exists, readByName will error. So we create a new tag
		try {
			const newTag = await createTag({ instanceId, body: { name: tagName } });
			log.debug(newTag, 'Created new tag');
			await createTagging({ instanceId, personId, tagId: newTag.id, t });
			log.debug({ instanceId, personId, tagName, newTag }, 'Added person to new tag');
		} catch (err) {
			//If something went wrong with the creation or adding of a new tag.
			log.debug({ instanceId, personId, tagName }, 'Unable to create tag');
		}
	}
}

import { readBySlug } from '$lib/server/api/events/events';
import { create as createAttendee } from '$lib/server/api/events/attendees';
async function addPersonToEvent({
	instanceId,
	personId,
	eventSlug,
	t,
	queue,
	importId
}: {
	instanceId: number;
	personId: number;
	eventSlug: string;
	t: App.Localization;
	queue: App.Queue;
	importId: number;
}): Promise<void> {
	try {
		const event = await readBySlug({ instanceId, slug: eventSlug });
		await createAttendee({
			instanceId,
			eventId: event.id,
			body: {
				person_id: personId,
				status: 'attended',
				send_notifications: false,
				notes: `import:${importId}`,
				response_channel: 'none'
			},
			t,
			queue
		});
		log.debug({ instanceId, personId, eventSlug }, 'Added person to event');
	} catch (err) {
		//no event?
		log.debug(
			{ instanceId, personId, eventSlug },
			'Unable to add person to event. Probably no event exists with this slug'
		);
	}
}
