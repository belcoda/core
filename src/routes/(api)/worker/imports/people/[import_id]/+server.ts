import { json, error, BelcodaError, pino } from '$lib/server';
import { getCsvFromBucket } from '$lib/server/utils/s3/put';
import { PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME } from '$env/static/public';
import { update } from '$lib/server/api/people/imports';
import * as csv from 'fast-csv';
import { create as createPerson } from '$lib/server/api/people/people';
import { create as createSchema } from '$lib/schema/people/people';
import { renderName } from '$lib/utils/text/names';
import { v, parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
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
				organization: v.nullable(v.string()),
				position: v.nullable(v.string()),
				address_line_1: v.nullable(v.string()),
				address_line_2: v.nullable(v.string()),
				city: v.nullable(v.string()),
				postcode: v.nullable(v.string()),
				state: v.nullable(v.string())
			}),
			v.transform((input) => {
				const hasPhoneNumber = input.phone_number && input.phone_number.length > 0;
				const hasEmail = input.email && input.email.length > 0;
				return {
					family_name: input.family_name,
					given_name: input.given_name,
					full_name: renderName(input, event.locals.instance.country),
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
								country: event.locals.instance.country
							},
					address_line_1: input.address_line_1,
					address_line_2: input.address_line_2,
					locality: input.city,
					postcode: input.postcode,
					state: input.state,
					country: event.locals.instance.country
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
				records.push(row);
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
						await createPerson({
							instance_id: event.locals.instance.id,
							admin_id: event.locals.admin.id,
							body: parsedItem,
							t: event.locals.t,
							queue: event.locals.queue,
							method: 'import'
						});
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
