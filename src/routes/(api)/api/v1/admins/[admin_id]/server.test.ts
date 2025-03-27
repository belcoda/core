import { expect, describe, it, vi, beforeEach } from 'vitest';
import { DELETE } from './+server';
import { Localization } from '$lib/i18n';
const t = new Localization('en');
import * as m from '$lib/paraglide/messages';
const mockQueue = vi.fn();

// Mock the error function from $lib/server
vi.mock('$lib/server', async () => {
	const actual = await vi.importActual('$lib/server');
	return {
		...actual,
		error: vi.fn((code, name, message, err) => {
			const body = {
				error: true,
				name: err instanceof Error ? err.name : name,
				message: err instanceof Error ? err.message : message,
				id: '1'
			};
			return new Response(JSON.stringify(body), {
				status: code,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		})
	};
});

vi.mock('$lib/server/api/core/admins', () => {
	const del = vi.fn();
	return { del };
});

describe('Admin Deletion API', () => {
	const mockEvent = {
		locals: {
			instance: { id: 1 },
			admin: { id: 2 },
			t,
			queue: mockQueue
		},
		params: { admin_id: '1' }
	};

	const mockEventSelfDeleteError = {
		locals: {
			instance: { id: 1 },
			admin: { id: 2 },
			t,
			queue: mockQueue
		},
		params: { admin_id: '2' }
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully deletes an admin', async () => {
		const { del } = await import('$lib/server/api/core/admins');
		vi.mocked(del).mockResolvedValueOnce(undefined);

		const response = await DELETE(mockEvent);
		const data = await response.json();

		expect(data).toEqual({ success: true });
		expect(del).toHaveBeenCalledWith({
			instance_id: 1,
			admin_id: 1,
			t: mockEvent.locals.t,
			currentlySignedInAdminId: 2,
			queue: mockQueue
		});
	});

	it('handles deletion error correctly', async () => {
		const { del } = await import('$lib/server/api/core/admins');
		const testError = new Error('Cannot delete last admin');
		vi.mocked(del).mockRejectedValueOnce(testError);

		// Get the mocked error function
		const { error } = await import('$lib/server');

		const response = await DELETE(mockEvent);

		// Check that error was called with the right parameters
		expect(error).toHaveBeenCalledWith(
			500,
			'API:/admins/[admin_id]:DELETE:01',
			expect.any(String),
			testError
		);

		// Check the status code
		expect(response.status).toBe(500);

		// Parse the response body
		const responseBody = await response.json();

		// Expect the error structure
		expect(responseBody).toEqual({
			error: true,
			name: 'Error',
			message: 'Cannot delete last admin',
			id: '1'
		});
	});

	it('stops an admin from deleting themselves', async () => {
		const { del } = await import('$lib/server/api/core/admins');
		const testError = new Error(m.wide_male_parrot_enrich());
		vi.mocked(del).mockRejectedValueOnce(testError);

		// Get the mocked error function
		const { error } = await import('$lib/server');

		const response = await DELETE(mockEventSelfDeleteError);

		// Check that error was called with the right parameters
		expect(error).toHaveBeenCalledWith(
			500,
			'API:/admins/[admin_id]:DELETE:01',
			expect.any(String),
			testError
		);

		// Check the status code
		expect(response.status).toBe(500);

		// Parse the response body
		const responseBody = await response.json();

		// Expect the error structure
		expect(responseBody).toEqual({
			error: true,
			name: 'Error',
			message: m.wide_male_parrot_enrich(),
			id: '1'
		});
	});
});
