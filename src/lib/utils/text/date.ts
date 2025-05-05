import { DateFormatter } from '@internationalized/date';

import { getLocale } from '$lib/paraglide/runtime';
import type { SupportedLanguage } from '$lib/i18n';

const df = new DateFormatter('en-US', {
	dateStyle: 'long'
});
const tf = new DateFormatter('en-US', {
	timeStyle: 'short'
});

export function formatDate(date: Date): string {
	return `${tf.format(date)} ${df.format(date)} `;
}

export function formatDateOnly(date: Date): string {
	return `${df.format(date)} `;
}

export function formatDateTimeRange(
	startDate: Date,
	endDate: Date,
	locale?: SupportedLanguage
): string {
	const language = locale || getLocale();
	const formatted = new Intl.DateTimeFormat(locale, {
		timeZoneName: 'long'
	}).formatToParts(startDate);
	const timeZone = formatted.find((part) => part.type === 'timeZoneName')?.value;
	return `${tf.format(startDate)} - ${tf.format(endDate)}, ${df.format(startDate)} (${timeZone}) `;
}

export function isToday(date: Date): boolean {
	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const targetDate = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
	);

	return today.getTime() === targetDate.getTime();
}

function isInThePast(date: Date): boolean {
	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const targetDate = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
	);

	return targetDate.getTime() < today.getTime();
}
