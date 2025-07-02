import { parseAbsoluteToLocal, parseDateTime, parseZonedDateTime } from '@internationalized/date';
import { ZonedDateTime } from '@internationalized/date';

/**
 * Handles minute rounding based on minuteSteps configuration
 * @param minutes - The actual minutes to round
 * @param minuteSteps - The step size to round to (must be a divisor of 60)
 * @returns Object containing rounded minutes and whether rounding occurred
 *
 * Examples:
 * - With minuteSteps = 15:
 *   - 22 minutes rounds to 15 (nearest quarter hour below)
 *   - 28 minutes rounds to 30 (nearest quarter hour above)
 * - With minuteSteps = 5:
 *   - 17 minutes rounds to 15 (nearest 5 minutes below)
 *   - 58 minutes rounds to 60/0 (rounds up to next hour)
 *
 * Edge cases:
 * - 60 minutes is normalized to 0 and triggers an hour increment
 * - When minuteSteps = 1, no rounding occurs
 */
export function roundMinutes(
	minutes: number,
	minuteSteps: number
): { roundedMinutes: number; wasRounded: boolean } {
	if (minuteSteps === 1) return { roundedMinutes: minutes, wasRounded: false };

	const roundedMinutes = Math.round(minutes / minuteSteps) * minuteSteps;
	return {
		roundedMinutes: roundedMinutes === 60 ? 0 : roundedMinutes,
		wasRounded: roundedMinutes !== minutes
	};
}

/**
 * Converts a Date object to a ZonedDateTime in the user's local timezone
 * This preserves the absolute time while displaying it in the user's timezone
 * Example: An event at 6pm GMT+9 will show as 12pm GMT+3 for a user in that timezone
 */
export function convertToUserTimezone(date: Date): ZonedDateTime {
	return parseAbsoluteToLocal(date.toISOString());
}

export function convertToTimezone(date: Date, tzString: string): Date {
	return new Date(
		date.toLocaleString('en-US', {
			timeZone: tzString
		})
	);
}

/**
 * Validates that minuteSteps is a valid divisor of 60
 * @param steps - The number of minutes to step by
 * @returns true if valid, false otherwise
 */
export function isValidMinuteStep(steps: number): boolean {
	const validSteps = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
	return validSteps.includes(steps);
}

export function zonedDateTimeToISO(zonedDateTime: ZonedDateTime) {
	const zonedIsoString = zonedDateTime.toString();
	// Remove the timezone region identifier (anything in square brackets)
	return zonedIsoString.replace(/\[.*\]$/, '');
}

/**
 * Takes an ISO datetime string and an IANA timezone string, and returns a new
 * ISO datetime string that represents the same "wall clock" time specified in the
 * input string, but as if it occurred in the target timezone. The output includes
 * the correct UTC offset for the target timezone at that local time.
 *
 * E.g. if input is "2025-05-13T10:00:00Z" (10 AM UTC) and the
 * target timezone is "America/New_York", output will  an ISO string
 * representing 10:00 AM in New York on May 13, 2025, along with New York's
 * offset at that time (e.g., "2025-05-13T10:00:00-04:00").
 *
 * @param isoDateTimeString The input ISO datetime string (e.g., "2025-05-13T10:00:00",
 * "2025-05-13T10:00:00Z", "2025-05-13T10:00:00.123+05:30").
 * @param targetIanaTimeZone The target IANA timezone string (e.g., "America/New_York",
 * "Asia/Tokyo", "Europe/London").
 * @returns An ISO datetime string (e.g., "YYYY-MM-DDTHH:mm:ss.sssOFFSET")
 * @throws Error if the input ISO datetime string format is invalid.
 */
export function setWallClockTimeToNewTimeZone(
	isoDateTime: string | Date,
	targetIanaTimeZone: string
): string {
	// Extract the local date/time (wall clock) part from the input string.
	// This regex captures the "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm:ss.sss" part,
	// effectively ignoring any original 'Z' or offset.
	const isoDateTimeString = isoDateTime instanceof Date ? isoDateTime.toISOString() : isoDateTime;
	const wallClockMatch = isoDateTimeString.match(
		/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?)/
	);

	if (!wallClockMatch || !wallClockMatch[0]) {
		throw new Error(
			`Invalid input ISO datetime string format: "${isoDateTime}". ` +
				'Expected YYYY-MM-DDTHH:mm:ss[.sss] at the start.'
		);
	}
	const localDateTimePart = wallClockMatch[0];

	const calendarDateTime = parseDateTime(localDateTimePart);
	const wallClockTimeString = calendarDateTime.toString();
	const stringWithTimezone = `${wallClockTimeString}[${targetIanaTimeZone}]`;

	return zonedDateTimeToISO(parseZonedDateTime(stringWithTimezone));
}

export function getISOStringWithOffset(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

	// getTimezoneOffset() returns the difference in minutes between UTC and local time.
	// It's positive if local time is behind UTC, and negative if local time is ahead of UTC.
	const offsetMinutes = date.getTimezoneOffset();
	const offsetSign = offsetMinutes <= 0 ? '+' : '-';
	const absOffsetHours = Math.abs(Math.floor(offsetMinutes / 60));
	const absOffsetMinutesPart = Math.abs(offsetMinutes % 60);

	const offsetString = `${offsetSign}${String(absOffsetHours).padStart(2, '0')}:${String(absOffsetMinutesPart).padStart(2, '0')}`;

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
}
