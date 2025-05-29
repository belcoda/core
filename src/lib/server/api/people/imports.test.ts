import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from './imports';
import * as schema from '$lib/schema/people/imports';
import { testDataPublicSchema } from '$lib/utils/testing/data/db';

// Mock dependencies
vi.mock('$lib/server', () => ({
	db: {
		insert: vi.fn(),
		select: vi.fn(),
		selectExactlyOne: vi.fn(),
		update: vi.fn(),
		count: vi.fn()
	},
	pool: {},
	redis: {
		del: vi.fn(),
		get: vi.fn(),
		set: vi.fn()
	},
	filterQuery: vi.fn(),
	BelcodaError: class extends Error {
		constructor(status: number, code: string, message: string) {
			super(message);
			this.name = 'BelcodaError';
		}
	}
}));

vi.mock('$lib/schema/valibot', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/schema/valibot')>();
	return {
		...actual,
		parse: vi.fn()
	};
});

vi.mock('$lib/paraglide/messages', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/paraglide/messages')>();
	return {
		...actual,
		pretty_tired_fly_lead: vi.fn(() => 'Update failed')
	};
});

import { db, pool, redis, filterQuery, BelcodaError } from '$lib/server';
import { parse } from '$lib/schema/valibot';

describe('people imports API', () => {
	const mockInstanceId = testDataPublicSchema.instances.id;
	const mockAdminId = 1;
	const mockImportId = 1;
	const mockCsvUrl = 'https://example.com/test.csv';

	// Mock queue function
	const mockQueue: App.Queue = vi.fn().mockResolvedValue(undefined);

	// Mock localization
	const mockT: App.Localization = {} as App.Localization;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('create', () => {
		const mockImportData = {
			id: mockImportId,
			csv_url: mockCsvUrl,
			status: 'pending' as const,
			total_rows: 0,
			processed_rows: 0,
			failed_rows: 0,
			created_at: new Date().toISOString(),
			completed_at: null
		};

		beforeEach(() => {
			vi.mocked(parse).mockImplementation((schema, data) => {
				// For create schema, add default status
				if (data && typeof data === 'object' && 'csv_url' in data && !('status' in data)) {
					return { ...data, status: 'pending' };
				}
				return data;
			});
			vi.mocked(db.insert).mockReturnValue({
				run: vi.fn().mockResolvedValue(mockImportData)
			} as any);
			vi.mocked(redis.del).mockResolvedValue(null);
		});

		it('should create a new import successfully', async () => {
			const result = await api.create({
				instanceId: mockInstanceId,
				csvUrl: mockCsvUrl,
				queue: mockQueue,
				adminId: mockAdminId
			});

			expect(db.insert).toHaveBeenCalledWith('people.imports', {
				instance_id: mockInstanceId,
				csv_url: mockCsvUrl,
				status: 'pending'
			});
			expect(redis.del).toHaveBeenCalledWith(`i:${mockInstanceId}:people:imports:all`);
			expect(mockQueue).toHaveBeenCalledWith(
				`/imports/people/${mockImportId}`,
				mockInstanceId,
				{},
				mockAdminId
			);
			expect(result).toEqual(mockImportData);
		});

		it('should parse input data with schema', async () => {
			await api.create({
				instanceId: mockInstanceId,
				csvUrl: mockCsvUrl,
				queue: mockQueue,
				adminId: mockAdminId
			});

			expect(parse).toHaveBeenCalledWith(schema.create, { csv_url: mockCsvUrl });
			expect(parse).toHaveBeenCalledWith(schema.read, mockImportData);
		});

		it('should handle database errors', async () => {
			vi.mocked(db.insert).mockReturnValue({
				run: vi.fn().mockRejectedValue(new Error('Database error'))
			} as any);

			await expect(
				api.create({
					instanceId: mockInstanceId,
					csvUrl: mockCsvUrl,
					queue: mockQueue,
					adminId: mockAdminId
				})
			).rejects.toThrow('Database error');
		});

		it('should handle queue errors', async () => {
			vi.mocked(mockQueue).mockRejectedValue(new Error('Queue error'));

			await expect(
				api.create({
					instanceId: mockInstanceId,
					csvUrl: mockCsvUrl,
					queue: mockQueue,
					adminId: mockAdminId
				})
			).rejects.toThrow('Queue error');
		});
	});

	describe('list', () => {
		const mockImports = [
			{
				id: 1,
				csv_url: 'https://belcoda.com/test1.csv',
				status: 'complete',
				total_rows: 100,
				processed_rows: 100,
				failed_rows: 0,
				created_at: new Date().toISOString(),
				completed_at: new Date().toISOString()
			},
			{
				id: 2,
				csv_url: 'https://belcoda.com/test2.csv',
				status: 'pending',
				total_rows: 0,
				processed_rows: 0,
				failed_rows: 0,
				created_at: new Date().toISOString(),
				completed_at: null
			}
		];

		const mockListResult = {
			items: mockImports,
			count: 2
		};

		beforeEach(() => {
			vi.mocked(parse).mockImplementation((schema, data) => data);
			vi.mocked(db.select).mockReturnValue({
				run: vi.fn().mockResolvedValue(mockImports)
			} as any);
			vi.mocked(db.count).mockReturnValue({
				run: vi.fn().mockResolvedValue(2)
			} as any);
		});

		it('should query database when no cache available', async () => {
			const mockUrl = new URL('http://localhost/api/v1/people/imports');
			vi.mocked(filterQuery).mockReturnValue({
				filtered: false,
				where: {},
				options: {
					offset: 0,
					limit: 10,
					order: { by: 'created_at', direction: 'DESC' }
				}
			} as any);
			vi.mocked(redis.get).mockResolvedValue(null);
			vi.mocked(redis.set).mockResolvedValue(undefined);

			const result = await api.list({
				instanceId: mockInstanceId,
				url: mockUrl
			});

			expect(db.select).toHaveBeenCalledWith(
				'people.imports',
				{ instance_id: mockInstanceId },
				{
					offset: 0,
					limit: 10,
					order: { by: 'created_at', direction: 'DESC' }
				}
			);
			expect(db.count).toHaveBeenCalledWith('people.imports', { instance_id: mockInstanceId });
			expect(redis.set).toHaveBeenCalledWith(
				`i:${mockInstanceId}:people:imports:all`,
				mockListResult
			);
			expect(result).toEqual(mockListResult);
		});

		it('should query database when filtered and not cache results', async () => {
			const mockUrl = new URL('http://localhost/api/v1/people/imports?status=complete');
			vi.mocked(filterQuery).mockReturnValue({
				filtered: true,
				where: { status: 'complete' },
				options: {
					offset: 0,
					limit: 10,
					order: { by: 'created_at', direction: 'DESC' }
				}
			} as any);

			const result = await api.list({
				instanceId: mockInstanceId,
				url: mockUrl
			});

			expect(redis.get).not.toHaveBeenCalled();
			expect(db.select).toHaveBeenCalled();
			expect(redis.set).not.toHaveBeenCalled();
			expect(result).toEqual(mockListResult);
		});

		it('should handle pagination options', async () => {
			const mockUrl = new URL('http://localhost/api/v1/people/imports?offset=20&limit=5');
			vi.mocked(filterQuery).mockReturnValue({
				filtered: false,
				where: {},
				options: {
					offset: 20,
					limit: 5,
					order: { by: 'created_at', direction: 'DESC' }
				}
			} as any);
			vi.mocked(redis.get).mockResolvedValue(null);

			await api.list({
				instanceId: mockInstanceId,
				url: mockUrl
			});

			expect(db.select).toHaveBeenCalledWith(
				'people.imports',
				{ instance_id: mockInstanceId },
				{
					offset: 20,
					limit: 5,
					order: { by: 'created_at', direction: 'DESC' }
				}
			);
		});
	});

	describe('read', () => {
		const mockImport = {
			id: mockImportId,
			csv_url: mockCsvUrl,
			status: 'complete' as const,
			total_rows: 100,
			processed_rows: 95,
			failed_rows: 5,
			created_at: new Date().toISOString(),
			completed_at: new Date().toISOString()
		};

		beforeEach(() => {
			vi.mocked(parse).mockImplementation((schema, data) => data);
			vi.mocked(db.selectExactlyOne).mockReturnValue({
				run: vi.fn().mockResolvedValue(mockImport)
			} as any);
		});

		it('should read a specific import by id', async () => {
			const result = await api.read({
				instanceId: mockInstanceId,
				importId: mockImportId
			});

			expect(db.selectExactlyOne).toHaveBeenCalledWith('people.imports', {
				instance_id: mockInstanceId,
				id: mockImportId
			});
			expect(parse).toHaveBeenCalledWith(schema.read, mockImport);
			expect(result).toEqual(mockImport);
		});

		it('should handle not found errors', async () => {
			vi.mocked(db.selectExactlyOne).mockReturnValue({
				run: vi.fn().mockRejectedValue(new Error('Not found'))
			} as any);

			await expect(
				api.read({
					instanceId: mockInstanceId,
					importId: 999
				})
			).rejects.toThrow('Not found');
		});
	});

	describe('update', () => {
		const mockUpdateData = {
			status: 'complete' as const,
			total_rows: 100,
			processed_rows: 95,
			failed_rows: 5
		};

		const mockUpdatedImport = {
			id: mockImportId,
			csv_url: mockCsvUrl,
			...mockUpdateData,
			completed_at: new Date().toISOString(),
			created_at: new Date().toISOString()
		};

		beforeEach(() => {
			vi.mocked(parse).mockImplementation((schema, data) => data);
			vi.mocked(db.update).mockReturnValue({
				run: vi.fn().mockResolvedValue([mockUpdatedImport])
			} as any);
			vi.mocked(redis.del).mockResolvedValue(null);
		});

		it('should update import successfully', async () => {
			const result = await api.update({
				instanceId: mockInstanceId,
				importId: mockImportId,
				body: mockUpdateData,
				t: mockT
			});

			expect(parse).toHaveBeenCalledWith(schema.update, mockUpdateData);
			expect(db.update).toHaveBeenCalledWith(
				'people.imports',
				expect.objectContaining({
					...mockUpdateData,
					completed_at: expect.any(Date)
				}),
				{ instance_id: mockInstanceId, id: mockImportId }
			);
			expect(redis.del).toHaveBeenCalledWith(`i:${mockInstanceId}:people:imports:all`);
			expect(result).toEqual(mockUpdatedImport);
		});

		it('should add completed_at when status is complete', async () => {
			await api.update({
				instanceId: mockInstanceId,
				importId: mockImportId,
				body: { status: 'complete' },
				t: mockT
			});

			expect(db.update).toHaveBeenCalledWith(
				'people.imports',
				expect.objectContaining({
					status: 'complete',
					completed_at: expect.any(Date)
				}),
				{ instance_id: mockInstanceId, id: mockImportId }
			);
		});

		it('should not add completed_at when status is not complete', async () => {
			await api.update({
				instanceId: mockInstanceId,
				importId: mockImportId,
				body: { status: 'processing' },
				t: mockT
			});

			expect(db.update).toHaveBeenCalledWith(
				'people.imports',
				{ status: 'processing' },
				{ instance_id: mockInstanceId, id: mockImportId }
			);
		});
	});
});
