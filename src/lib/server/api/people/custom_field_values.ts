import { db, pool, pino, redis, error, BelcodaError } from '$lib/server';
const log = pino(import.meta.url);
import { read as readCustomField } from '$lib/server/api/people/custom_fields';
import { readFieldValue } from '$lib/schema/people/custom_field_values';
import { redisString } from '$lib/server/api/people/people';
import { parse } from '$lib/schema/valibot';

export async function setCustomFieldValue({
	instance_id,
	person_id,
	fieldName,
	value,
	t
}: {
	instance_id: number;
	person_id: number;
	fieldName: string;
	value: string;
	t: App.Localization;
}) {
	const customField = await readCustomField({
		instance_id,
		custom_field_name: fieldName,
		t
	});

	const customFieldValue = await db
		.upsert(
			'people.custom_field_values',
			{ value: value, custom_field_id: customField.id, person_id: person_id },
			['custom_field_id', 'person_id']
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PEOPLE:CUSTOM_FIELD_VALUES:SET:01',
				t.errors.updating_data(),
				err
			);
		});

	await redis.del(redisString(instance_id, person_id));
	await redis.del(redisString(instance_id, 'all'));
	log;
	return parse(readFieldValue, {
		field: customField.name,
		value: customFieldValue.value,
		person_id: person_id
	});
}
