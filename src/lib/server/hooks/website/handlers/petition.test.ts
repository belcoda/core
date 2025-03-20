import { expect, it, describe, vi } from 'vitest';
import handler from './petition';

import { Localization } from '$lib/i18n';
const t = new Localization('en');

vi.mock('$lib/server/api/petitions/petitions', () => ({
	readBySlug: vi.fn()
}));
vi.mock('$lib/server/utils/handlebars/render', () => ({
	default: vi.fn()
}));

import { error404, error500 } from '$lib/server/hooks/website/handlers/errors';
import { testDataPublicSchema, testDataPetitionsSchema } from '$lib/utils/testing/data/db';

describe('eventHandler', () => {
	const instance = testDataPublicSchema.instances;
	const { petitions: petitionPage } = testDataPetitionsSchema;

	it('should return 404 if content_slug is missing', async () => {
		await expect(
			handler({
				content_slug: null,
				code: null,
				method: 'GET',
				//@ts-expect-error (instance is not going to be the correct type)
				instance,
				t
			})
		).rejects.toEqual(error404);
	});
});
