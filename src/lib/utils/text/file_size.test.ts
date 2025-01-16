import { describe, it, expect } from 'vitest';
import { humanReadableFileSize } from '$lib/utils/text/file_size'; // Adjust the path as necessary

describe('humanReadableFileSize', () => {
	it('should return "0 B" for 0 bytes', () => {
		expect(humanReadableFileSize(0)).toBe('0 B');
	});

	it('should return bytes in base 1024 by default', () => {
		expect(humanReadableFileSize(500)).toBe('500 B');
		expect(humanReadableFileSize(1024)).toBe('1.0 KiB');
		expect(humanReadableFileSize(1536)).toBe('1.5 KiB');
	});

	it('should return bytes in SI base 1000 when `si` is true', () => {
		expect(humanReadableFileSize(500, true)).toBe('500 B');
		expect(humanReadableFileSize(1000, true)).toBe('1.0 kB');
		expect(humanReadableFileSize(1500, true)).toBe('1.5 kB');
	});

	it('should handle larger units in base 1024', () => {
		expect(humanReadableFileSize(1048576)).toBe('1.0 MiB');
		expect(humanReadableFileSize(1073741824)).toBe('1.0 GiB');
		expect(humanReadableFileSize(1099511627776)).toBe('1.0 TiB');
	});

	it('should handle larger units in SI base 1000', () => {
		expect(humanReadableFileSize(1000000, true)).toBe('1.0 MB');
		expect(humanReadableFileSize(1000000000, true)).toBe('1.0 GB');
		expect(humanReadableFileSize(1000000000000, true)).toBe('1.0 TB');
	});

	it('should round to the specified number of decimal places', () => {
		expect(humanReadableFileSize(1536, false, 2)).toBe('1.50 KiB');
		expect(humanReadableFileSize(1500, true, 2)).toBe('1.50 kB');
		expect(humanReadableFileSize(1048576, false, 0)).toBe('1 MiB');
	});

	it('should handle negative byte values', () => {
		expect(humanReadableFileSize(-1024)).toBe('-1.0 KiB');
		expect(humanReadableFileSize(-1500, true)).toBe('-1.5 kB');
	});

	it('should handle edge cases for small values close to thresholds', () => {
		expect(humanReadableFileSize(1023, false)).toBe('1023 B');
		expect(humanReadableFileSize(999, true)).toBe('999 B');
	});

	it('should handle extremely large values', () => {
		expect(humanReadableFileSize(1e24, true)).toBe('1.0 YB'); // Yottabytes in SI
		expect(humanReadableFileSize(2 ** 80, false)).toBe('1.0 YiB'); // Yobibytes in base 1024
	});
});
