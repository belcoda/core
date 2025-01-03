import { describe, it, expect } from 'vitest';

import { slugify } from '$lib/utils/text/string';

describe('Utility function to convert strings into slugs', () => {
	it('Converts spaces to underscores', () => {
		expect(slugify('foo bar')).toBe('foo_bar');
	});
	it('Converts multiple spaces to a single underscore', () => {
		expect(slugify('foo   bar')).toBe('foo_bar');
	});
	it('Converts dashes and semicolons to a single underscore', () => {
		expect(slugify('foo-;-bar')).toBe('foo_bar');
	});
	it('Replaces multiple underscores with a single underscore', () => {
		expect(slugify('foo___bar')).toBe('foo_bar');
	});
	it('Converts all strings to lowercase', () => {
		expect(slugify('Foo_bAr')).toBe('foo_bar');
	});
	it('Strips accents and diacritics from latin characters', () => {
		expect(slugify('føó bær')).toBe('foo_bar');
	});
	it('Removes all non latin characters', () => {
		expect(slugify('こんにちは')).toBe('');
	});
});
