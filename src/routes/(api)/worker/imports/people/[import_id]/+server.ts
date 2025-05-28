import { json, error, BelcodaError, pino } from '$lib/server';
import { getCsvFromBucket } from '$lib/server/utils/s3/put';
import { PUBLIC_AWS_S3_USER_IMPORT_BUCKET_NAME } from '$env/static/public';
import { update } from '$lib/server/api/people/imports';
import { type SupportedCountry, SUPPORTED_COUNTRIES } from '$lib/i18n/index.js';
import * as csv from 'fast-csv';
import { create as createPerson, parseImportCsv } from '$lib/server/api/people/people';
import { create as createSchema } from '$lib/schema/people/people';
import { renderName } from '$lib/utils/text/names';
import { v, parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

export async function POST(event) {
	try {
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
		const records = await parseImportCsv(
			resultText,
			importId,
			event.locals.instance,
			event.locals.admin.id,
			event.locals.queue,
			event.locals.t
		);

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
