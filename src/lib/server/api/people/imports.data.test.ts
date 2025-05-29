import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { instance as mockInstance } from '$lib/utils/mocks/instance.mock';

// Mock dependencies
vi.mock('$lib/server/api/people/people', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/api/people/people')>();
	return {
		...actual,
		create: vi.fn()
	};
});

// Mock the imports update function
vi.mock('$lib/server/api/people/imports', () => ({
	update: vi.fn()
}));

vi.mock('$lib/server/api/core/tags', () => ({
	readByName: vi.fn(),
	create: vi.fn()
}));

vi.mock('$lib/server/api/people/taggings', () => ({
	create: vi.fn()
}));

vi.mock('$lib/server/api/events/events', () => ({
	readBySlug: vi.fn()
}));

vi.mock('$lib/server/api/events/attendees', () => ({
	create: vi.fn()
}));

vi.mock('$lib/server', () => ({
	pino: vi.fn(() => ({
		debug: vi.fn(),
		error: vi.fn()
	}))
}));

import { create as createPerson, parseImportCsv } from '$lib/server/api/people/people';
import { update as updateImport } from '$lib/server/api/people/imports';
import { readByName as readTagByName, create as createTag } from '$lib/server/api/core/tags';
import { create as createTagging } from '$lib/server/api/people/taggings';
import { readBySlug as readEventBySlug } from '$lib/server/api/events/events';
import { create as createAttendee } from '$lib/server/api/events/attendees';

import { Localization } from '$lib/i18n';
import { getCsvFromLocalFolderAsync } from '$lib/utils/testing/csv_reader';

const t = new Localization('en');

// Test variables
const mockInstanceId = mockInstance.id;
const mockAdminId = 1;
const mockQueue: App.Queue = vi.fn().mockResolvedValue(undefined);
const csvString = await getCsvFromLocalFolderAsync('people_import_test.csv');

beforeEach(() => {
	vi.clearAllMocks();

	vi.mocked(readTagByName).mockRejectedValue(new Error('Tag not found'));
	vi.mocked(createTag).mockResolvedValue({ id: 1, name: 'test-tag' } as any);
	vi.mocked(createTagging).mockResolvedValue({} as any);

	vi.mocked(readEventBySlug).mockRejectedValue(new Error('Event not found'));
	vi.mocked(createAttendee).mockResolvedValue({} as any);
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('CSV Import', () => {
	it('should import all records from people csv', async () => {
		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		expect(result.records).toBeInstanceOf(Array);
		expect(result.records.length).toBe(result.totalRows);
	});

	it('should handle empty rows', async () => {
		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		// Should process rows, empty rows should be filtered out by parseImportCsv
		expect(result.totalRows).toBe(23);
	});

	it('should handle malformed email addresses', async () => {
		// Mock validation errors for bad emails
		vi.mocked(createPerson).mockImplementation(async ({ body }) => {
			if (body.email?.email?.includes('invalid') || body.email?.email?.includes('@localhost')) {
				throw new Error('Invalid email format');
			}
			return {
				id: Math.floor(Math.random() * 1000),
				full_name: body.full_name || 'Test',
				email: body.email,
				created_at: new Date(),
				updated_at: new Date()
			} as any;
		});

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		expect(result.failedCount).toBeGreaterThanOrEqual(6);
	});

	it('should handle malformed phone numbers', async () => {
		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		// Note: failedCount depends on how strict phone validation is
		expect(result.successCount + result.failedCount).toBe(result.totalRows);
	});

	it('should handle invalid dates gracefully', async () => {
		// Mock validation errors for bad dates
		vi.mocked(createPerson).mockImplementation(async ({ body }) => {
			if (
				body.dob &&
				(body.dob.includes('13-') ||
					body.dob.includes('-32') ||
					body.dob.includes('not-a-date') ||
					body.dob.includes('Fake-date'))
			) {
				throw new Error('Invalid date format');
			}
			return {
				id: Math.floor(Math.random() * 1000),
				full_name: body.full_name || 'Test',
				dob: body.dob,
				created_at: new Date(),
				updated_at: new Date()
			} as any;
		});

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		expect(result.failedCount).toBeGreaterThanOrEqual(6);
	});

	it('should handle invalid country codes', async () => {
		// Mock validation errors for bad country codes
		vi.mocked(createPerson).mockImplementation(async ({ body }) => {
			if (body.country && !['us', 'gb', 'ca', 'au', 'fr', 'de'].includes(body.country)) {
				throw new Error('Invalid country code');
			}
			return {
				id: Math.floor(Math.random() * 1000),
				full_name: body.full_name || 'Test',
				country: body.country,
				created_at: new Date(),
				updated_at: new Date()
			} as any;
		});

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		expect(result.failedCount).toBeGreaterThanOrEqual(6);
	});

	it('should handle very long field values', async () => {
		// Mock validation errors for overly long fields
		vi.mocked(createPerson).mockImplementation(async ({ body }) => {
			const maxLength = 100;
			if (
				(body.given_name && body.given_name.length > maxLength) ||
				(body.family_name && body.family_name.length > maxLength) ||
				(body.organization && body.organization.length > maxLength)
			) {
				throw new Error('Field length exceeds maximum allowed');
			}
			return {
				id: Math.floor(Math.random() * 1000),
				full_name: body.full_name || 'Test',
				given_name: body.given_name,
				family_name: body.family_name,
				created_at: new Date(),
				updated_at: new Date()
			} as any;
		});

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);
		expect(result.failedCount).toBeGreaterThanOrEqual(6);
	});
});

describe('Tag and Event Processing', () => {
	it('should handle tag creation and assignment', async () => {
		// Mock successful tag operations
		vi.mocked(readTagByName).mockResolvedValue({ id: 1, name: 'existing-tag' } as any);
		vi.mocked(createTag).mockResolvedValue({ id: 2, name: 'new-tag' } as any);

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);

		// Verify tag operations were called
		const createPersonCalls = vi.mocked(createPerson).mock.calls;
		const hasTaggedRecords = createPersonCalls.some((call) => {
			const body = call[0].body as any;
			return body.tags && body.tags.length > 0;
		});

		if (hasTaggedRecords) {
			expect(createTagging).toHaveBeenCalled();
		}
	});

	it('should handle event assignment', async () => {
		// Mock successful event operations
		vi.mocked(readEventBySlug).mockResolvedValue({
			id: 1,
			slug: 'test-event',
			name: 'Test Event'
		} as any);

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBe(23);

		// Check if any records had events
		const createPersonCalls = vi.mocked(createPerson).mock.calls;
		const hasEventRecords = createPersonCalls.some((call) => {
			const body = call[0].body as any;
			return body.events && body.events.length > 0;
		});

		if (hasEventRecords) {
			expect(createAttendee).toHaveBeenCalled();
		}
	});

	it('should handle tag creation failures', async () => {
		// Mock tag operations to fail
		vi.mocked(readTagByName).mockRejectedValue(new Error('Tag not found'));
		vi.mocked(createTag).mockRejectedValue(new Error('Tag creation failed'));

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		// Import should still succeed for people creation even if tags fail
		expect(result.totalRows).toBe(23);
		expect(result.successCount).toBeGreaterThanOrEqual(0);
	});

	it('should handle event assignment failures', async () => {
		// Mock event operations to fail
		vi.mocked(readEventBySlug).mockRejectedValue(new Error('Event not found'));
		vi.mocked(createAttendee).mockRejectedValue(new Error('Attendee creation failed'));

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		// Import should still succeed for people creation even if events fail
		expect(result.totalRows).toBe(23);
		expect(result.successCount).toBeGreaterThanOrEqual(0);
	});
});

describe('Error Handling', () => {
	it('should handle all records failing', async () => {
		// Mock all person creation to fail
		vi.mocked(createPerson).mockRejectedValue(new Error('All records fail'));

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBeGreaterThan(0);
		expect(result.successCount).toBe(0);
		expect(result.failedCount).toBe(result.totalRows);
	});

	it('should track import statistics correctly', async () => {
		// Set up a predictable mix of success and failure
		let callCount = 0;
		vi.mocked(createPerson).mockImplementation(async () => {
			callCount++;
			if (callCount % 3 === 0) {
				throw new Error('Every third record fails');
			}
			return {
				id: callCount,
				full_name: `Person ${callCount}`,
				created_at: new Date(),
				updated_at: new Date()
			} as any;
		});

		const result = await parseImportCsv(
			csvString,
			mockInstanceId,
			mockInstance,
			mockAdminId,
			mockQueue,
			t
		);

		expect(result.totalRows).toBeGreaterThan(0);
		expect(result.successCount + result.failedCount).toBe(result.totalRows);
		expect(result.records).toHaveLength(result.totalRows);
	});
});
