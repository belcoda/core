import { json, error, pino } from '$lib/server';
import { setFieldValue } from '$lib/schema/people/custom_field_values';
import { setCustomFieldValue } from '$lib/server/api/people/custom_field_values';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(setFieldValue, body); //because we want to allow custom fields to be passed through to the function
		const customFieldValue = await setCustomFieldValue({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			fieldName: parsed.field,
			value: parsed.value,
			t: event.locals.t
		});
		//TODO: Submit the custom field, and return an error if the field NAME doesn't exist on the instance...
		return json(customFieldValue);
	} catch (err) {
		return error(
			500,
			'WORKER:/core/people/custom_fields/set_custom_field:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}
