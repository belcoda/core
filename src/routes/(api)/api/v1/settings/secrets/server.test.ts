import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PUT, GET } from './+server';
import { update as updateSecrets, _readSecretsUnsafe } from '$lib/server/api/core/instances';
import { parse } from '$lib/schema/valibot';
import { instance as mockInstance, secrets as mockSecrets } from '$lib/utils/mocks/instance.mock';
import { Localization } from '$lib/i18n';

const t = new Localization('en');
vi.mock('$lib/server/api/core/instances', () => ({
	updateSecrets: vi.fn(),
	_readSecretsUnsafe: vi.fn(),
	update: vi.fn()
}));

vi.mock('$lib/schema/communications/email/messages', () => ({
	emailTemplates: ['main'] // mocks imported email template schema
}));
vi.mock('$lib/server', () => ({
	json: vi.fn((data) => ({
		status: 200,
		body: data
	})),
	error: vi.fn((status, code, message) => ({
		status,
		body: { error: code },
		message
	}))
}));

vi.mock('$lib/schema/valibot');

describe('PUT /settings/secrets', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should update secrets successfully', async () => {
		const event = {
			locals: {
				instance: { id: '123' },
				t
			},
			request: {
				json: vi.fn().mockResolvedValue({ secrets: mockSecrets })
			}
		};

		vi.mocked(parse).mockReturnValue(mockSecrets);
		vi.mocked(updateSecrets).mockResolvedValue(mockInstance);
		vi.mocked(_readSecretsUnsafe).mockResolvedValue(mockSecrets);

		const response = await PUT(event);

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockSecrets);
		expect(updateSecrets).toHaveBeenCalledWith({
			instanceId: '123',
			body: { secrets: mockSecrets }
		});
	});

	it('should handle errors', async () => {
		const event = {
			locals: {
				instance: { id: '123' },
				t
			},
			request: {
				json: vi.fn().mockResolvedValue({ secrets: { invalidKey: 'value' } })
			}
		};

		vi.mocked(updateSecrets).mockRejectedValue(new Error('Error updating secrets'));

		const response = await PUT(event);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: 'API:/settings/secrets:PUT:01' });
	});
});

describe('GET /settings/secrets', () => {
	it('should read secrets successfully', async () => {
		const event = {
			locals: {
				instance: { id: '123' }
			}
		};

		vi.mocked(_readSecretsUnsafe).mockResolvedValue(mockSecrets);

		const response = await GET(event);

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockSecrets);
	});

	it('should handle errors', async () => {
		const event = {
			locals: {
				instance: { id: '123' },
				t
			}
		};

		vi.mocked(_readSecretsUnsafe).mockRejectedValue(new Error('Error reading secrets'));

		const response = await GET(event);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: 'API:/settings/secrets:GET:01' });
	});
});
