import { json, error, pino } from '$lib/server';
import { setCustomFieldValue } from '$lib/server/api/people/custom_field_values';
import * as m from '$lib/paraglide/messages';
import { setFieldValueFromApi } from '$lib/schema/people/custom_field_values';
import { parse } from '$lib/schema/valibot';

const log = pino(import.meta.url);

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(setFieldValueFromApi, body);
		const upserted = await setCustomFieldValue({
			instance_id: event.locals.instance.id,
			person_id: Number(event.params.person_id),
			fieldName: parsed.field,
			value: parsed.value,
			t: event.locals.t
		});
		return json(upserted);
	} catch (err) {
		return error(
			500,
			'API:/people/custom_fields/values/:person_id/:field:PUT:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
