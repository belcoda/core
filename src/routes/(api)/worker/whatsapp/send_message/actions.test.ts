import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendNextMessageIfExists, createInteractionDetails, sendMessageToYCloud } from './actions'; // adjust the path
import { read as readMessage } from '$lib/server/api/communications/whatsapp/messages';

vi.mock('$lib/server/api/communications/whatsapp/messages', () => ({
	read: vi.fn()
}));

describe('sendNextMessageIfExists', () => {
	it('should do nothing if there is no next message', async () => {
		const result = await sendNextMessageIfExists({
			instanceId: 1,
			t: {} as any,
			message: { next: null } as any,
			adminId: 1,
			personId: 1,
			queue: vi.fn()
		});
		expect(result).toBeUndefined();
	});

	it('should read next message and queue it', async () => {
		const mockQueue = vi.fn();
		(readMessage as any).mockResolvedValue({ id: 'next-message-id' });

		await sendNextMessageIfExists({
			instanceId: 1,
			t: {} as any,
			message: { next: 'next-message-id' } as any,
			adminId: 1,
			personId: 1,
			queue: mockQueue
		});

		expect(mockQueue).toHaveBeenCalledTimes(1);
	});
});

import { read as readTemplate } from '$lib/server/api/communications/whatsapp/templates';
import { _getThreadByStartingMessageId } from '$lib/server/api/communications/whatsapp/threads';

vi.mock('$lib/server/api/communications/whatsapp/threads', () => ({
	_getThreadByStartingMessageId: vi.fn()
}));

vi.mock('$lib/server/api/communications/whatsapp/templates', () => ({
	read: vi.fn()
}));

describe('createInteractionDetails', () => {
	it('should return interaction details for normal messages', async () => {
		const message = { message: { type: 'text' }, id: 'message-id' } as any;

		const details = await createInteractionDetails({
			message,
			instanceId: 1,
			sentMessageId: 'sent-id',
			t: {} as any
		});

		expect(details).toEqual({
			type: 'outbound_whatsapp',
			message_id: 'message-id',
			message: message.message
		});
	});

	it('should return interaction details for template messages', async () => {
		(_getThreadByStartingMessageId as any).mockResolvedValue({ template_id: 'template-id' });
		(readTemplate as any).mockResolvedValue({ message: { content: 'template-content' } });

		const message = { message: { type: 'template' }, id: 'message-id' } as any;

		const details = await createInteractionDetails({
			message,
			instanceId: 1,
			sentMessageId: 'sent-id',
			t: {} as any
		});

		expect(details).toEqual({
			type: 'outbound_whatsapp',
			message_id: 'sent-id',
			message: message.message,
			template: { content: 'template-content' }
		});
	});
});

import { _readSecretsUnsafe } from '$lib/server/api/core/instances';

vi.mock('$lib/server/api/core/instances', () => ({
	_readSecretsUnsafe: vi.fn()
}));

global.fetch = vi.fn();

describe('sendMessageToYCloud', () => {
	const validPerson = {
		phone_number: { phone_number: '+14155552671', country: 'US' },
		id: 1
	};

	const validMessage = {
		id: 'message-id',
		message: { type: 'text', text: { body: 'hello' } }
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('throws if person has no phone number', async () => {
		await expect(
			sendMessageToYCloud({
				person: { phone_number: null } as any,
				message: validMessage as any,
				phoneNumber: '+11234567890',
				instanceId: 1,
				sentMessageId: 'uuid'
			})
		).rejects.toThrow();
	});

	it('throws if fetch fails', async () => {
		(_readSecretsUnsafe as any).mockResolvedValue({ WHATSAPP_ACCESS_KEY: 'key' });
		(global.fetch as any).mockResolvedValue({ ok: false, json: vi.fn().mockResolvedValue({}) });

		await expect(
			sendMessageToYCloud({
				person: validPerson as any,
				message: validMessage as any,
				phoneNumber: '+11234567890',
				instanceId: 1,
				sentMessageId: 'uuid'
			})
		).rejects.toThrow('YCloud API responded with an error');
	});

	it('returns parsed successful response', async () => {
		(_readSecretsUnsafe as any).mockResolvedValue({ WHATSAPP_ACCESS_KEY: 'key' });
		(global.fetch as any).mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({
				to: '14155552671',
				id: 'id',
				status: 'accepted',
				wamid: 'wamid',
				wabaId: 'wabaId',
				from: '00000000000',
				type: 'text',
				text: {
					body: 'hello'
				}
			})
		});

		const response = await sendMessageToYCloud({
			person: validPerson as any,
			message: validMessage as any,
			phoneNumber: '+11234567890',
			instanceId: 1,
			sentMessageId: 'uuid'
		});

		expect(response).toHaveProperty('to');
		expect(response).toHaveProperty('wamid');
	});
});
