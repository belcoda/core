import { describe, it, expect } from 'vitest';
import { roundMinutes, isValidMinuteStep } from './datetime';
import { timezone } from '$lib/schema/utils/datetime';
import { parse } from '$lib/schema/valibot';

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
});

describe('Timezone Validation', () => {
	it('should accept valid IANA timezones', () => {
		const validTimezones = [
			'Etc/UTC',
			'America/New_York',
			'Europe/London',
			'Asia/Tokyo',
			'Australia/Sydney',
			'Pacific/Auckland'
		];

		validTimezones.forEach((tz) => {
			expect(() => parse(timezone, tz)).not.toThrow();
		});
	});

	it('should reject invalid timezone strings', () => {
		const invalidTimezones = [
			'Invalid/Timezone',
			'Not/A/Timezone',
			'Random/Place',
			'Fake/Region',
			'Test/Zone',
			'Dummy/Area',
			'Mock/Location',
			'Example/Region',
			'Sample/Zone',
			'Dummy/Timezone'
		];

		invalidTimezones.forEach((tz) => {
			expect(() => parse(timezone, tz)).toThrow();
		});
	});

	it('should reject non-string values', () => {
		const invalidValues = [123, true, false, null, undefined, {}, [], () => {}];

		invalidValues.forEach((value) => {
			expect(() => parse(timezone, value as any)).toThrow();
		});
	});
});
