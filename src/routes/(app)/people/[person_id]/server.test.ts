import { expect, describe, it, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import type { ErrorSchema } from '$lib/server';
import type { HttpError } from '@sveltejs/kit';

const mockFetch = vi.fn();

describe('Person Delete Action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully deletes a person', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true
		});

		const result = await actions.delete({
			params: { person_id: '123' },
			fetch: mockFetch
		});

		expect(result).toEqual({ success: true });
		expect(mockFetch).toHaveBeenCalledWith('/api/v1/people/123', {
			method: 'DELETE'
		});
	});

	it('handles deletion failure', async () => {
		const errorBody: ErrorSchema = {
			error: true,
			name: 'Unknown Error',
			message: 'Not Found',
			id: 'error-123',
			code: 404
		};
		const errorResponse = {
			ok: false,
			status: 404,
			statusText: 'Not Found',
			json: () => Promise.resolve(errorBody)
		};
		mockFetch.mockResolvedValueOnce(errorResponse);

		try {
			await actions.delete({
				params: { person_id: '123' },
				fetch: mockFetch
			});
			// If we get here, the test should fail because we expect an error
			expect(true).toBe(false);
		} catch (err) {
			const httpError = err as HttpError;
			expect(httpError.status).toBe(404);
			expect(httpError.body).toEqual(errorBody);
		}

		expect(mockFetch).toHaveBeenCalledWith('/api/v1/people/123', {
			method: 'DELETE'
		});
	});
});
