import { expect, it, describe, vi } from 'vitest';
import handler from './content';

import { readBySlug as readContentTypeBySlug } from '$lib/server/api/website/content_types';
import { readBySlug as readContentBySlug } from '$lib/server/api/website/content';
import renderHandlebarsTemplate from '$lib/server/utils/handlebars/render';

import { Localization } from '$lib/i18n';
const t = new Localization('en');

vi.mock('$lib/server/api/website/content_types', () => ({
	readBySlug: vi.fn()
}));
vi.mock('$lib/server/api/website/content', () => ({
	readBySlug: vi.fn()
}));
vi.mock('$lib/server/utils/handlebars/render', () => ({
	default: vi.fn()
}));

import { error404, error500 } from '$lib/server/hooks/website/handlers/errors';
import { testDataPublicSchema, testDataWebsiteSchema } from '$lib/utils/testing/data/db';

describe('contentHandler', () => {
	const instance = testDataPublicSchema.instances;
	const { contentTypePost, contentTypePage, content } = testDataWebsiteSchema;

	it('should return 404 if content_slug is missing', async () => {
		await expect(
			handler({
				content_slug: null,
				content_type_slug: 'NotHere',
				code: null,
				method: 'GET',
				//@ts-expect-error (instance is not going to be the correct type)
				instance,
				t
			})
		).rejects.toEqual(error404);
	});

	it('should return 404 if content_type_slug is missing', async () => {
		await expect(
			handler({
				content_slug: 'content',
				content_type_slug: null,
				code: null,
				method: 'GET',
				//@ts-expect-error (instance is not going to be the correct type)
				instance,
				t
			})
		).rejects.toEqual(error404);
	});

	it('should return 404 if readContentTypeBySlug fails', async () => {
		vi.mocked(readContentTypeBySlug).mockRejectedValue(new Error('Database error'));
		await expect(
			handler({
				content_slug: 'content',
				content_type_slug: 'type',
				code: null,
				method: 'GET',
				//@ts-expect-error (instance is not going to be the correct type)
				instance,
				t
			})
		).rejects.toEqual(error404);
	});

	it('should return a 200 response with valid content', async () => {
		//@ts-expect-error (contentType is not going to be the correct type)
		vi.mocked(readContentTypeBySlug).mockResolvedValue(contentTypePage);
		//@ts-expect-error (feature image isn't present in test content)
		vi.mocked(readContentBySlug).mockResolvedValue(content);
		vi.mocked(renderHandlebarsTemplate).mockResolvedValue('<html>Rendered</html>');
		const response = await handler({
			content_slug: 'content',
			content_type_slug: 'page',
			code: null,
			method: 'GET',
			//@ts-expect-error (instance is not going to be the correct type)
			instance,
			t
		});

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/html');
		const text = await response.text();
		expect(text).toContain('Rendered');
	});
});
