import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => Promise<Response>;

import { admin as mockAdmin } from '$lib/utils/mocks/admin.mock';
import { instance as mockInstance } from '$lib/utils/mocks/instance.mock';

const whatsappMessageBase = {
	id: 'test',
	wabaId: 'test',
	from: 'test',
	to: mockInstance.settings.communications.whatsapp.phone_number
};

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const YCLOUD_VERIFY_TOKEN = 'mocked-token';
const PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER = '+440123456789';

const resolve: Resolve = async (event: RequestEvent, opts?: ResolveOptions) => {
	return new Response('ok', {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

import { Localization } from '$lib/i18n';
const t = new Localization('en');

let event: Partial<RequestEvent> = {
	request: {
		json: vi.fn()
	} as any,
	url: new URL(`https://example.com/?verify=${YCLOUD_VERIFY_TOKEN}`),
	locals: {
		language: 'en',
		t: t,
		admin: mockAdmin,
		instance: mockInstance,
		queue: vi.fn()
	}
};
// set up mocks
beforeEach(async () => {
	vi.mock('$env/static/public', async (importOriginal) => {
		const actual = await importOriginal();
		return {
			...(actual as typeof import('$env/static/public')),
			PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER: '+440123456789'
		};
	});
	vi.mock('$env/static/private', async (importOriginal) => {
		const actual = await importOriginal();
		console.trace('Accessing PGHOST mocks');
		return {
			...(actual as typeof import('$env/static/private')),
			LOG_LEVEL: 'debug',
			YCLOUD_VERIFY_TOKEN: 'mocked-token'
		};
	});

	vi.mock('$lib/server/api/core/instances', () => ({
		_getInstanceByWhatsappPhoneNumber: vi.fn(async () => mockInstance),
		_getInstanceByEventId: vi.fn(async () => mockInstance),
		_getInstanceByPetitionId: vi.fn(async () => mockInstance)
	}));

	vi.mock('$lib/server/api/communications/whatsapp/messages', () => ({
		_getInstanceIdBySentMessageIdUnsafe: vi.fn(async () => mockInstance.id),
		_getInstanceIdByWamidUnsafe: vi.fn(async () => mockInstance.id),
		_getInstanceIdByActionUuidUnsafe: vi.fn(async () => mockInstance.id)
	}));
});

afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
});

//import the functions to test after mocks have been set up

describe('extractCodeFromMessage', async () => {
	const extractCodeFromMessage = await (
		await import('$lib/server/hooks/whatsapp/ycloud')
	).extractCodeFromMessage;
	it('parses valid SIGNUP message', () => {
		const message = {
			type: 'whatsapp.inbound_message.received',
			whatsappInboundMessage: {
				text: { body: '[SIGNUP:123]' }
			}
		};
		expect(extractCodeFromMessage(message as any)).toEqual({ action: 'SIGNUP', id: 123 });
	});

	it('throws on invalid message type', () => {
		expect(() =>
			extractCodeFromMessage({
				type: 'something.else',
				whatsappInboundMessage: { text: { body: '[SIGNUP:123]' } }
			} as any)
		).toThrow('Message type is not whatsapp.inbound_message.received');
	});

	it('throws if no code in message', () => {
		expect(() =>
			extractCodeFromMessage({
				type: 'whatsapp.inbound_message.received',
				whatsappInboundMessage: { text: { body: 'hello' } }
			} as any)
		).toThrow('No identifier found');
	});
});

describe('isDefaultWhatsAppNumber', async () => {
	const isDefaultWhatsAppNumber = await (
		await import('$lib/server/hooks/whatsapp/ycloud')
	).isDefaultWhatsAppNumber;
	it('returns true if matches default number', () => {
		expect(isDefaultWhatsAppNumber(PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER)).toBe(true);
	});

	it('returns false for non-matching number', () => {
		expect(isDefaultWhatsAppNumber('0000')).toBe(false);
	});

	it('throws if no number given', () => {
		expect(() => isDefaultWhatsAppNumber('')).toThrow(/No phone number provided/);
	});
});

describe('checkYCloudToken', async () => {
	const checkYCloudToken = await (
		await import('$lib/server/hooks/whatsapp/ycloud')
	).checkYCloudToken;
	it('passes if token matches', () => {
		const event = {
			url: new URL(`https://test.com/?verify=${YCLOUD_VERIFY_TOKEN}`)
		};
		expect(() => checkYCloudToken(event as RequestEvent)).not.toThrow();
	});

	it('throws if token mismatches', () => {
		const event = {
			url: new URL('https://test.com/?verify=wrong')
		};
		expect(() => checkYCloudToken(event as RequestEvent)).toThrow(/Invalid Ycloud verify token/);
	});
});

describe('webhook handler', async () => {
	const handler = await (await import('$lib/server/hooks/whatsapp/ycloud')).default;
	it('handles updates and send the correct queue message', async () => {
		const mockBody = {
			id: 'testID',
			apiVersion: 'v2',
			createTime: '2025-04-06T15:00:00+09:00',
			type: 'whatsapp.message.updated',
			whatsappMessage: {
				...whatsappMessageBase,
				externalId: 'testId',
				status: 'sent',
				type: 'text'
			}
		};
		(event.request!.json as any).mockResolvedValue(mockBody);
		event.url = new URL(`https://test.com/?verify=${YCLOUD_VERIFY_TOKEN}`);
		const handlerOutput = await handler(event as RequestEvent, resolve);
		expect(handlerOutput.continue).toBe(false);
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).toHaveBeenCalledOnce();
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).toHaveBeenCalledWith(
			'/whatsapp/webhook/ycloud/update',
			mockInstance.id,
			mockBody
		);
	});

	it('handles SIGNUP message and sends the correct queue message', async () => {
		const mockBody = {
			id: 'testID',
			apiVersion: 'v2',
			createTime: '2025-04-06T15:00:00+09:00',
			type: 'whatsapp.inbound_message.received',
			whatsappInboundMessage: {
				...whatsappMessageBase,
				externalId: undefined,
				status: undefined,
				sendTime: '2025-04-06T15:00:00+09:00',
				customerProfile: {
					name: 'test'
				},
				type: 'text',
				text: { body: 'Signup message [SIGNUP:123]' }
			}
		};

		(event.request!.json as any).mockResolvedValue(mockBody);
		const handlerOutput = await handler(event as RequestEvent, resolve);
		expect(handlerOutput.continue).toBe(false);
		//@ts-expect-error response.status will be undefined if continue is true but it shouldn't be here...
		expect(event.locals.queue).toHaveBeenCalledOnce();
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).toHaveBeenCalledWith(
			'/whatsapp/webhook/ycloud/incoming/text/action',
			mockInstance.id,
			mockBody
		);
	});

	it('handles unknown text message and does not queue anything when the phone number is the same as the default', async () => {
		//default has been mocked to be the same as the mocked instance phone number
		const mockBody = {
			id: 'testID',
			apiVersion: 'v2',
			createTime: '2025-04-06T15:00:00+09:00',
			type: 'whatsapp.inbound_message.received',
			whatsappInboundMessage: {
				...whatsappMessageBase,
				sendTime: '2025-04-06T15:00:00+09:00',
				type: 'text',
				customerProfile: {
					name: 'test'
				},
				to: PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER, //this is the default number
				text: { body: 'random text' }
			}
		};

		(event.request!.json as any).mockResolvedValue(mockBody);

		const handlerOutput = await handler(event as RequestEvent, resolve);

		expect(handlerOutput.continue).toBe(false);
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).not.toHaveBeenCalled();
	});

	it('handles unknown text message and queues a text message when the phone number is not default and does match an instance', async () => {
		//default has been mocked to be the same as the mocked instance phone number
		const mockBody = {
			id: 'testID',
			apiVersion: 'v2',
			createTime: '2025-04-06T15:00:00+09:00',
			type: 'whatsapp.inbound_message.received',
			whatsappInboundMessage: {
				...whatsappMessageBase,
				sendTime: '2025-04-06T15:00:00+09:00',
				customerProfile: {
					name: 'test'
				},
				type: 'text',
				to: '+44252525555', //this is not the default number, and because the function to find instance by number is mocked it will return
				text: { body: 'random text' }
			}
		};

		(event.request!.json as any).mockResolvedValue(mockBody);

		const handlerOutput = await handler(event as RequestEvent, resolve);

		expect(handlerOutput.continue).toBe(false);
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).toHaveBeenCalledOnce();
		//@ts-expect-error event.locals may be undefined but shouldn't be here
		expect(event.locals.queue).toHaveBeenCalledWith(
			'/whatsapp/webhook/ycloud/incoming/text',
			mockInstance.id,
			mockBody
		);
	});
});
