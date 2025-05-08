import { isValidIANATimezone } from '$lib/i18n/timezones';
import { v } from '$lib/schema/valibot';

export const timezone = v.pipe(
	v.string(),
	v.custom(
		(input: unknown): input is string => typeof input === 'string' && isValidIANATimezone(input),
		'Must be Etc/UTC or a valid IANA timezone'
	)
);
