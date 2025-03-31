import { renderRegistrationLink } from './whatsapp';
import { formatDate } from './date';
import { describe, it, expect } from 'vitest';
import { instance } from '$lib/utils/mocks/instance.mock';
import { mockEvent } from '$lib/utils/mocks/event.mock';
import { mockPetition } from '$lib/utils/mocks/petition.mock';

describe('renderRegistrationLink', () => {
	it('should generate correct link for an event', () => {
		const result = renderRegistrationLink(instance, mockEvent);
		const expectedText = `Hi! I'm interested in ${mockEvent.name} [SIGNUP:${mockEvent.id}] on ${formatDate(mockEvent.starts_at)}`;

		expect(result.text).toBe('Whatsapp registration link');
		expect(result.url).toBe(`https://wa.me/1234567890?text=${encodeURIComponent(expectedText)}`);
	});

	it('should generate correct link for a petition', () => {
		const result = renderRegistrationLink(instance, mockPetition);
		const expectedText = `Hi! I would like to sign the petition ${mockPetition.name} [PETITION:${mockPetition.id}]`;

		expect(result.text).toBe('Whatsapp registration link');
		expect(result.url).toBe(`https://wa.me/1234567890?text=${encodeURIComponent(expectedText)}`);
	});

	it('should handle phone numbers with plus sign', () => {
		const result = renderRegistrationLink(instance, mockEvent);
		expect(result.url).toContain('https://wa.me/1234567890');
	});
});
