import { vi, describe, it, expect } from 'vitest';
import { updateNotes } from './actions';
import * as stringUtils from '$lib/utils/text/string';

const MOCK_UPDATED_NOTE = {
	type: 'notes',
	notes: 'Test note content',
	edit_history: [
		{
			edited_by: 1,
			edited_at: new Date(),
			prior_state: 'Old note content'
		}
	]
};

const MOCK_ADMIN = {
	id: 1,
	email: `admin@example.com`,
	full_name: 'Example Admin',
	profile_picture_url: null,
	permissions: ['all'],
	active: true,
	has_signed_in: true,
	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null
};

const MOCK_RETURNED_INTERACTION = {
	id: 1,
	person_id: 1,
	admin: MOCK_ADMIN,
	details: MOCK_UPDATED_NOTE,
	created_at: new Date()
};

describe('updateNotes', () => {
	it('should send a PUT request with sanitized notes', async () => {
		const mockFetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(MOCK_RETURNED_INTERACTION)
			})
		);
		//@ts-ignore
		global.fetch = mockFetch;

		const interactionId = 123;
		const personId = 456;
		const updatedNotes = ' New Note Content ';

		const sanitizedNotes = stringUtils.sanitizeHTML(updatedNotes); // Expected sanitized result
		const sanitizeSpy = vi.spyOn(stringUtils, 'sanitizeHTML');

		const result = await updateNotes({ interactionId, personId, updatedNotes });

		expect(mockFetch).toHaveBeenCalledWith(
			`/api/v1/people/456/interactions/notes/123`,
			expect.objectContaining({
				method: 'PUT',
				body: JSON.stringify({ note: sanitizedNotes })
			})
		);
		expect(result).toEqual(MOCK_RETURNED_INTERACTION);
		expect(sanitizeSpy).toHaveBeenCalledWith(updatedNotes);
	});

	it('should throw an error if the fetch request fails', async () => {
		const mockFetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				json: () => Promise.resolve({ message: 'Error' })
			})
		);
		//@ts-ignore
		global.fetch = mockFetch;

		await expect(
			updateNotes({ interactionId: 123, personId: 456, updatedNotes: 'Note' })
		).rejects.toThrow('Failed to update notes');
	});

	it('should sanitize HTML input in the notes', async () => {
		const mockFetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(MOCK_RETURNED_INTERACTION)
			})
		);
		//@ts-ignore
		global.fetch = mockFetch;

		const interactionId = 123;
		const personId = 456;
		const updatedNotes = '<script>alert("xss")</script>';

		await updateNotes({ interactionId, personId, updatedNotes });

		expect(mockFetch).toHaveBeenCalledWith(
			`/api/v1/people/456/interactions/notes/123`,
			expect.objectContaining({
				method: 'PUT',
				body: JSON.stringify({ note: '' }) // the script tag should be removed
			})
		);
	});
});
