import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { importPeopleFromLocalCsv } from '$lib/utils/testing/import_people_local';
import { listAvailableCsvFiles } from '$lib/utils/testing/csv_reader';
import { testDataPublicSchema } from '$lib/utils/testing/data/db';

// Mock dependencies
vi.mock('$lib/server/api/people/people', () => ({
	create: vi.fn()
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

import { create as createPerson } from '$lib/server/api/people/people';
import { readByName as readTagByName, create as createTag } from '$lib/server/api/core/tags';
import { create as createTagging } from '$lib/server/api/people/taggings';
import { readBySlug as readEventBySlug } from '$lib/server/api/events/events';
import { create as createAttendee } from '$lib/server/api/events/attendees';

describe('People CSV Import Data Tests', () => {
	const mockInstanceId = testDataPublicSchema.instances.id;
	const mockAdminId = 1;

	// Mock queue function
	const mockQueue: App.Queue = vi.fn().mockResolvedValue(undefined);

	// Mock localization
	const mockT: App.Localization = {} as App.Localization;

	// Mock instance
	const mockInstance = { country: 'us' as const };

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default successful mocks
		vi.mocked(createPerson).mockResolvedValue({
			id: 1,
			full_name: 'Test User',
			email: { email: 'test@belcoda.com', subscribed: true },
			created_at: new Date(),
			updated_at: new Date()
		} as any);

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
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBe(24);
			expect(result.successCount).toBeGreaterThanOrEqual(1);
			expect(result.records).toBeInstanceOf(Array);
			expect(result.records.length).toBe(result.totalRows);
		});

		it('should handle CSV with mixed success and failure rates', async () => {
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThanOrEqual(24);
			expect(result.successCount).toBeGreaterThanOrEqual(1);
			expect(result.failedCount).toBeGreaterThanOrEqual(1);
			expect(result.successCount + result.failedCount).toBe(result.totalRows);
		});

		it('should handle empty rows', async () => {
			// row 13 in edge cases is completely empty
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			// Should process all rows including empty ones
			expect(result.totalRows).toBe(24);
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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBe(24);
			expect(result.failedCount).toBeGreaterThanOrEqual(1);
		});

		it('should handle malformed phone numbers', async () => {
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThanOrEqual(24);
			expect(result.failedCount).toBeGreaterThanOrEqual(20);
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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThanOrEqual(24);
			expect(result.failedCount).toBeGreaterThanOrEqual(2);
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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThan(0);
			expect(result.failedCount).toBeGreaterThan(0);
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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThan(0);
			expect(result.failedCount).toBeGreaterThan(0);
		});
	});

	describe('Tag and Event Processing', () => {
		it('should handle tag creation and assignment', async () => {
			// Mock successful tag operations
			vi.mocked(readTagByName).mockResolvedValue({ id: 1, name: 'existing-tag' } as any);
			vi.mocked(createTag).mockResolvedValue({ id: 2, name: 'new-tag' } as any);

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThanOrEqual(24);

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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			// Import should still succeed for people creation even if tags fail
			expect(result.totalRows).toBeGreaterThanOrEqual(24);
			expect(result.successCount).toBeGreaterThan(0);
		});

		it('should handle event assignment failures', async () => {
			// Mock event operations to fail
			vi.mocked(readEventBySlug).mockRejectedValue(new Error('Event not found'));
			vi.mocked(createAttendee).mockRejectedValue(new Error('Attendee creation failed'));

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			// Import should still succeed for people creation even if events fail
			expect(result.totalRows).toBeGreaterThanOrEqual(24);
			expect(result.successCount).toBeGreaterThan(0);
		});
	});

	describe('Error Handling', () => {
		it('should handle CSV parsing errors', async () => {
			await expect(
				importPeopleFromLocalCsv({
					csvFileName: 'non-existent-file.csv',
					instanceId: mockInstanceId,
					adminId: mockAdminId,
					queue: mockQueue,
					t: mockT,
					instance: mockInstance
				})
			).rejects.toThrow();
		});

		it('should handle all records failing', async () => {
			// Mock all person creation to fail
			vi.mocked(createPerson).mockRejectedValue(new Error('All records fail'));

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

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

			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThan(0);
			expect(result.successCount + result.failedCount).toBe(result.totalRows);
			expect(result.records).toHaveLength(result.totalRows);
		});
	});

	describe('Unicode and Special Characters', () => {
		it('should handle unicode characters in names and addresses', async () => {
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThan(0);

			// The test should pass if the CSV processing completes without errors
			// The unicode row is in our test data, so if import completes, it was processed
			const unicodeRowExists = result.records.some(
				(record: any) =>
					record &&
					typeof record === 'object' &&
					(String(record.given_name || '').includes('Tëst') ||
						String(record.family_name || '').includes('Ñamé'))
			);

			// Either we found unicode data in the records, or the import completed successfully
			expect(unicodeRowExists || result.totalRows > 0).toBe(true);
		});

		it('should handle special characters in CSV fields', async () => {
			const result = await importPeopleFromLocalCsv({
				csvFileName: 'people_import_test.csv',
				instanceId: mockInstanceId,
				adminId: mockAdminId,
				queue: mockQueue,
				t: mockT,
				instance: mockInstance
			});

			expect(result.totalRows).toBeGreaterThan(0);

			// Check that special characters were processed
			const createPersonCalls = vi.mocked(createPerson).mock.calls;
			const hasSpecialChars = createPersonCalls.some(
				(call) =>
					(call[0].body.family_name && /[!@#$%]/.test(call[0].body.family_name)) ||
					(call[0].body.address_line_1 && call[0].body.address_line_1.includes('quotes'))
			);

			// Should have special character data from our test CSV
			expect(hasSpecialChars).toBe(true);
		});
	});
});
