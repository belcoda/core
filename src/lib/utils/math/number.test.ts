import { isBigger } from '$lib/utils/math/number';
import { expect, it, describe } from 'vitest';

describe('isBigger', () => {
	it('should return true if a is bigger than b', () => {
		expect(isBigger(2, 1)).toBe(true);
	});

	it('should return false if a is smaller than b', () => {
		expect(isBigger(1, 2)).toBe(false);
	});

	it('should return false if a is equal to b', () => {
		expect(isBigger(1, 1)).toBe(false);
	});

	it('should return false if a is a negative number and b is a positive number', () => {
		expect(isBigger(-1, 1)).toBe(false);
	});

	it('should return true if a is a positive number and b is a negative number', () => {
		expect(isBigger(1, -1)).toBe(true);
	});

	it("shouldn't be tricked by floating point precision", () => {
		expect(isBigger(0.1 + 0.2, 0.3)).toBe(true);
	});

	it('should return false if a is NaN', () => {
		expect(isBigger(NaN, 1)).toBe(false);
	});

	it('should return false if b is NaN', () => {
		expect(isBigger(1, NaN)).toBe(false);
	});

	it('should return false if a and b are NaN', () => {
		expect(isBigger(NaN, NaN)).toBe(false);
	});

	it('should return true if a is Infinity', () => {
		expect(isBigger(Infinity, 1)).toBe(true);
	});

	it('should return false if b is Infinity', () => {
		expect(isBigger(1, Infinity)).toBe(false);
	});

	it('should return false if a is -Infinity', () => {
		expect(isBigger(-Infinity, 1)).toBe(false);
	});

	it('should return true if b is -Infinity', () => {
		expect(isBigger(1, -Infinity)).toBe(true);
	});

	it('should return false if a is -Infinity and b is Infinity', () => {
		expect(isBigger(-Infinity, Infinity)).toBe(false);
	});

	it('should return true if a is Infinity and b is -Infinity', () => {
		expect(isBigger(Infinity, -Infinity)).toBe(true);
	});

	it('should return false if a is -0', () => {
		expect(isBigger(-0, 0)).toBe(false);
	});

	it('should return false if b is -0', () => {
		expect(isBigger(0, -0)).toBe(false);
	});

	it("shouldn't be tricked by integer overflows", () => {
		expect(isBigger(9007199254740991, 9007199254740992)).toBe(false);
	});
});
