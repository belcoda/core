import { describe, it, expect } from 'vitest';
import { parse } from '$lib/schema/valibot';
import { htmlMetatags } from '$lib/schema/utils/openai';

describe('Validation schemas for OpenAI integration', () => {
	it('Accepts the specified types of schemas', () => {
		parse(htmlMetatags, { type: 'event', eventId: 1 });
		parse(htmlMetatags, { type: 'petition', petitionId: 1 });
		parse(htmlMetatags, { type: 'content', contentId: 1, contentTypeId: 1 });
	});
	it('Rejects invalid types of schemas', () => {
		expect(() => parse(htmlMetatags, { type: 'person', personId: 1 })).toThrow();
	});
});
