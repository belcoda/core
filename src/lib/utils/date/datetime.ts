import { parseAbsoluteToLocal } from '@internationalized/date';
import type { ZonedDateTime } from '@internationalized/date';

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

/**
 * Validates that minuteSteps is a valid divisor of 60
 * @param steps - The number of minutes to step by
 * @returns true if valid, false otherwise
 */
export function isValidMinuteStep(steps: number): boolean {
	const validSteps = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
	return validSteps.includes(steps);
}
