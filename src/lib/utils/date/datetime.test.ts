import { describe, it, expect } from 'vitest';
import { roundMinutes, convertToUserTimezone, isValidMinuteStep } from './datetime';

describe('DateTime Component Utils', () => {
	describe('isValidMinuteStep', () => {
		it('should validate correct minute steps', () => {
			const validSteps = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
			validSteps.forEach((step) => {
				expect(isValidMinuteStep(step)).toBe(true);
			});
		});

		it('should reject invalid minute steps', () => {
			const invalidSteps = [0, 7, 8, 9, 11, 13, 14, 16, 25, 35, 45, 61];
			invalidSteps.forEach((step) => {
				expect(isValidMinuteStep(step)).toBe(false);
			});
		});

		it('should reject negative values', () => {
			expect(isValidMinuteStep(-5)).toBe(false);
			expect(isValidMinuteStep(-15)).toBe(false);
		});

		it('should reject non-integer values', () => {
			expect(isValidMinuteStep(5.5)).toBe(false);
			expect(isValidMinuteStep(15.7)).toBe(false);
		});
	});
	describe('roundMinutes', () => {
		it('should not round when minuteSteps is 1', () => {
			const result = roundMinutes(17, 1);
			expect(result.roundedMinutes).toBe(17);
			expect(result.wasRounded).toBe(false);
		});

		it('should round to nearest 5 minutes', () => {
			const cases = [
				{ input: 17, expected: 15 },
				{ input: 18, expected: 20 },
				{ input: 58, expected: 0 } // rounds to next hour
			];

			cases.forEach(({ input, expected }) => {
				const result = roundMinutes(input, 5);
				expect(result.roundedMinutes).toBe(expected);
				expect(result.wasRounded).toBe(input !== expected);
			});
		});

		it('should round to nearest 15 minutes', () => {
			const cases = [
				{ input: 22, expected: 15 },
				{ input: 28, expected: 30 },
				{ input: 52, expected: 45 },
				{ input: 58, expected: 0 } // rounds to next hour
			];

			cases.forEach(({ input, expected }) => {
				const result = roundMinutes(input, 15);
				expect(result.roundedMinutes).toBe(expected);
				expect(result.wasRounded).toBe(input !== expected);
			});
		});
	});

	describe('timezone conversion', () => {
		// TODO: I have commented out timezone tests because they are difficult to reliably
		// TODO: test locally and have the same results on a CI server that runs on a different timezone.

		// it('should preserve absolute time while converting to local timezone', () => {
		// 	// Create a date at 6pm GMT+9 (15:00 UTC)
		// 	const tokyoDate = new Date('2024-03-15T15:00:00Z');

		// 	// Convert to local timezone (GMT+3)
		// 	const localZoned = convertToUserTimezone(tokyoDate);

		// 	// Get the hour in local time (18:00 in GMT+3)
		// 	const localHour = localZoned.hour;

		// 	// 15:00 UTC should be 18:00 in GMT+3
		// 	expect(localHour).toBe(18);
		// });

		// it('should handle daylight saving time transitions', () => {
		// 	// Note: Since I'm in GMT+3 which doesn't observe DST, we'll test time consistency
		// 	const beforeDST = new Date('2024-03-31T01:30:00+03:00');
		// 	const afterDST = new Date('2024-03-31T02:30:00+03:00');

		// 	const localBefore = convertToUserTimezone(beforeDST);
		// 	const localAfter = convertToUserTimezone(afterDST);

		// 	// Verify one hour difference
		// 	expect(localAfter.hour - localBefore.hour).toBe(1);
		// });

		it('should handle dates across midnight', () => {
			// Create a date at 23:00 GMT+3
			const lateDate = new Date('2024-03-15T23:00:00+03:00');
			const nextDate = new Date('2024-03-16T01:00:00+03:00');

			const localLate = convertToUserTimezone(lateDate);
			const localNext = convertToUserTimezone(nextDate);

			// Verify correct dates
			expect(localLate.day).toBe(15);
			expect(localNext.day).toBe(16);

			// Verify hours
			expect(localLate.hour).toBe(23);
			expect(localNext.hour).toBe(1);
		});
	});
});
