import { expect, it, describe, vi } from 'vitest';
import handler from './event';

import { Localization } from '$lib/i18n';
const t = new Localization('en');

vi.mock('$lib/server/api/events/event', () => ({
	readBySlug: vi.fn()
}));
vi.mock('$lib/server/utils/handlebars/render', () => ({
	default: vi.fn()
}));

import { error404, error500 } from '$lib/server/hooks/website/handlers/errors';
import { testDataPublicSchema, testDataEventsSchema } from '$lib/utils/testing/data/db';

describe('eventHandler', () => {
	const instance = testDataPublicSchema.instances;
	const { events: eventPage } = testDataEventsSchema;

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
