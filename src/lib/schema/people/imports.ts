import { v, url, timestamp, count, id } from '$lib/schema/valibot';
import { status } from '../communications/whatsapp/numbers';
import { type SupportedCountry, SUPPORTED_COUNTRIES } from '$lib/i18n/index.js';
import { renderName } from '$lib/utils/text/names';
import { type Read as ReadInstance } from '$lib/schema/core/instance';

export const base = v.object({
	id: id,
	instance_id: id,
	csv_url: url,
	status: v.picklist(['pending', 'processing', 'complete', 'failed']),
	total_rows: count,
	processed_rows: count,
	failed_rows: count,
	created_at: timestamp,
	completed_at: timestamp
});

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const create = v.object({
	csv_url: base.entries.csv_url,
	status: v.optional(base.entries.status, 'pending')
});
export type Create = v.InferOutput<typeof create>;
export type CreateInput = v.InferInput<typeof create>;

export const list = v.object({
	items: v.array(read),
	count: count
});
export type List = v.InferOutput<typeof list>;

export const update = v.partial(
	v.object({
		status: v.optional(base.entries.status),
		total_rows: v.optional(base.entries.total_rows),
		processed_rows: v.optional(base.entries.processed_rows),
		failed_rows: v.optional(base.entries.failed_rows),
		failed_rows_details: v.optional(
			v.array(
				v.object({
					row: v.number(),
					error: v.string()
				})
			)
		)
	})
);
export type Update = v.InferOutput<typeof update>;

export function getParseSchema(instance: ReadInstance) {
	return v.pipe(
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
						if (!input || input.trim() === '') return instance.country;

						const normalized = input.toLowerCase().trim();

						// If it's already a valid 2-letter ISO code
						if (
							normalized.length === 2 &&
							SUPPORTED_COUNTRIES.includes(normalized as SupportedCountry)
						) {
							return normalized;
						}

						// Default to instance country if no match found
						return instance.country;
					})
				)
			),
			organization: v.nullable(v.string()),
			position: v.nullable(v.string()),
			gender: v.pipe(
				v.nullable(v.string()),
				v.transform((input) => {
					if (!input || input.trim() === '') return null;
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
				v.nullable(v.picklist(['male', 'female', 'other', 'not_specified']))
			),
			date_of_birth: v.nullable(v.string()),
			preferred_language: v.pipe(
				v.nullable(v.string()),
				v.transform((input) => {
					if (!input || input.trim() === '') return null;
					const trimmed = input.trim();
					// Check if it's a valid 2-letter code (letters only)
					if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) {
						return trimmed.toLowerCase();
					}
					// Accept other strings as-is
					return trimmed;
				})
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
				: instance.country;

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
							subscribed: input.email_subscribed.toLowerCase() === 'true'
						},
				phone_number: !hasPhoneNumber
					? null
					: {
							phone_number: input.phone_number,
							subscribed: input.phone_subscribed.toLowerCase() === 'true',
							country: inputCountry,
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
				preferred_language: input.preferred_language || instance.language,
				gender: input.gender || 'not_specified',
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
}

export interface ImportResult {
	totalRows: number;
	successCount: number;
	failedCount: number;
	records: unknown[];
}
