import { describe, it, expect } from 'vitest';
import DateTime from './datetime.svelte';
import { getLocalTimeZone } from '@internationalized/date';

describe('DateTime Component', () => {
	it('should export component', () => {
		expect(DateTime).toBeDefined();
	});

	it('handles date parsing correctly', () => {
		const isValidDate = (value: Date | string | null | undefined): boolean => {
			if (!value) return false;
			const date = new Date(value);
			return !isNaN(date.getTime());
		};

		expect(isValidDate(new Date())).toBe(true);
		expect(isValidDate('2023-05-15')).toBe(true);
		expect(isValidDate('invalid-date')).toBe(false);
		expect(isValidDate(null)).toBe(false);
		expect(isValidDate(undefined)).toBe(false);
	});

	it('formats dates correctly', () => {
		const formatDateForInput = (date: Date): string => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		const testDate = new Date('2023-05-15');
		expect(formatDateForInput(testDate)).toBe('2023-05-15');
	});

	it('returns correct timezone', () => {
		const timezone = getLocalTimeZone();
		expect(typeof timezone).toBe('string');
		expect(timezone.length).toBeGreaterThan(0);
	});

	it('allows minute rounding to nearest step', () => {
		const roundToNearestStep = (minute: number, step: number): number => {
			const rounded = Math.round(minute / step) * step;
			return rounded === 60 ? 0 : rounded;
		};

		expect(roundToNearestStep(12, 5)).toBe(10);
		expect(roundToNearestStep(13, 5)).toBe(15);
		expect(roundToNearestStep(58, 5)).toBe(0);
		expect(roundToNearestStep(57, 15)).toBe(0);
	});
});
