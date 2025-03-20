import { describe, it, expect } from 'vitest';
import { checkFileSize, checkFileType } from '$lib/comps/ui/form/controls/file_upload/upload';
import { Localization } from '$lib/i18n';

import * as m from '$lib/paraglide/messages';

const t = new Localization('en');

describe('checkFileType', () => {
	it('should not throw an error if file type is allowed', () => {
		const file = new File([], 'test.jpg', { type: 'image/jpeg' });
		expect(() => checkFileType(file, t, ['image/jpeg', 'image/png'])).not.toThrow();
	});

	it('should throw an error if file type is not allowed', () => {
		const file = new File([], 'test.txt', { type: 'text/plain' });
		expect(() => checkFileType(file, t, ['image/jpeg', 'image/png'])).toThrowError(
			m.mushy_bright_crossbill_pinch({ supportedTypes: 'image/jpeg, image/png' })
		);
	});

	it('should include all allowed types in the error message', () => {
		const file = new File([], 'test.pdf', { type: 'application/pdf' });
		expect(() => checkFileType(file, t, ['image/jpeg', 'image/png', 'text/plain'])).toThrowError(
			m.mushy_bright_crossbill_pinch({ supportedTypes: 'image/jpeg, image/png, text/plain' })
		);
	});
});

describe('checkFileSize', () => {
	it('should not throw an error if file size is within limit', () => {
		const file = createFileFromBuffer(1024, 'test.jpg'); // 1.0 KiB
		expect(() => checkFileSize(file, t, 2048)).not.toThrow();
	});

	it('should throw an error if file size exceeds limit', () => {
		const file = createFileFromBuffer(5 * 1024, 'test.jpg'); // 5.0 KiB
		expect(() => checkFileSize(file, t, 2048)).toThrowError(
			m.home_late_crossbill_reside({ maxFileSize: '2.0 KiB' })
		);
	});

	it('should format the max size correctly in the error message', () => {
		const file = createFileFromBuffer(5000000, 'test.jpg');
		expect(
			() => checkFileSize(file, t, 1024 * 1024) // 1 MiB
		).toThrowError(m.home_late_crossbill_reside({ maxFileSize: '1.0 MiB' }));
	});
});

export function createFileFromBuffer(sizeInBytes: number, fileName: string): File {
	// Generate a random buffer of the specified size
	const buffer = new Uint8Array(sizeInBytes);

	// Fill the buffer with random data (for simplicity, using random byte values)
	for (let i = 0; i < sizeInBytes; i++) {
		buffer[i] = Math.floor(Math.random() * 256); // Random byte (0-255)
	}

	// Create a Blob from the buffer
	const blob = new Blob([buffer], { type: 'application/octet-stream' });

	// Create a File from the Blob, with the provided name
	return new File([blob], fileName, { type: 'application/octet-stream' });
}
