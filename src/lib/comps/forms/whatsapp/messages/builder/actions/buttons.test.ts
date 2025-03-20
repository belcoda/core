import { describe, it, expect, vi } from 'vitest';
import {
	addButton,
	removeButton
} from '$lib/comps/forms/whatsapp/messages/builder/actions/buttons';

const mockedUUID = '9f4d2b16-3a72-4bfb-bc6e-d6fbcbb6c582';
vi.mock('uuid', () => ({
	v4: () => mockedUUID
}));

describe('addButton', () => {
	it('should add a button to an interactive message', () => {
		const message = {
			type: 'interactive' as 'interactive',
			interactive: {
				type: 'button' as 'button',
				body: { text: 'Message' },
				action: { buttons: [] }
			}
		};
		expect(addButton(message)).toEqual({
			...message,
			interactive: {
				...message.interactive,
				action: {
					buttons: [{ type: 'reply', reply: { id: mockedUUID, title: '[Button title]' } }]
				}
			}
		});
	});

	it('should convert a text message to an interactive message with a button', () => {
		const message = { type: 'text' as 'text', text: { body: 'Hello', preview_url: false } };
		expect(addButton(message)).toEqual({
			...message,
			type: 'interactive',
			interactive: {
				body: { text: 'Hello' },
				type: 'button',
				action: { buttons: [{ type: 'reply', reply: { id: mockedUUID, title: '[Button title]' } }] }
			}
		});
	});

	it('should convert an image message to an interactive message with a button', () => {
		const message = {
			type: 'image' as 'image',
			image: { caption: 'Look!', link: 'https://example.com/image.jpg' }
		};
		expect(addButton(message)).toEqual({
			...message,
			type: 'interactive',
			interactive: {
				body: { text: 'Look!' },
				header: { type: 'image', image: { link: 'https://example.com/image.jpg' } },
				type: 'button',
				action: { buttons: [{ type: 'reply', reply: { id: mockedUUID, title: '[Button title]' } }] }
			}
		});
	});

	it('should return the original message if type is not interactive, text, or image', () => {
		const message = { type: 'video' as 'video', video: { link: 'https://example.com/video.mp4' } };
		expect(addButton(message)).toBe(message);
	});
});

describe('removeButton', () => {
	it('should remove a button from an interactive message', () => {
		const message = {
			type: 'interactive' as 'interactive',
			interactive: {
				type: 'button' as 'button',
				body: { text: 'Hello' },
				action: {
					buttons: [
						{ type: 'reply' as 'reply', reply: { id: mockedUUID, title: 'Button 1' } },
						{ type: 'reply' as 'reply', reply: { id: mockedUUID, title: 'Button 2' } }
					]
				}
			}
		};

		expect(removeButton(message, 0)).toEqual({
			...message,
			interactive: {
				...message.interactive,
				action: {
					buttons: [{ type: 'reply', reply: { id: mockedUUID, title: 'Button 2' } }]
				}
			}
		});
	});

	it('should convert an interactive message with one button into a text message', () => {
		const message = {
			type: 'interactive' as 'interactive',
			interactive: {
				type: 'button' as 'button',
				body: { text: 'Hello' },
				action: {
					buttons: [{ type: 'reply' as 'reply', reply: { id: mockedUUID, title: 'Button 1' } }]
				}
			}
		};

		expect(removeButton(message, 0)).toEqual({
			type: 'text',
			text: { body: 'Hello', preview_url: false }
		});
	});

	it('should convert an interactive message with an image and one button into an image message', () => {
		const message = {
			type: 'interactive' as 'interactive',
			interactive: {
				type: 'button' as 'button',
				body: { text: 'Hello' },
				header: { type: 'image' as 'image', image: { link: 'https://example.com/image.jpg' } },
				action: { buttons: [{ type: 'reply' as 'reply', reply: { id: '1', title: 'Button 1' } }] }
			}
		};

		expect(removeButton(message, 0)).toEqual({
			type: 'image',
			image: { link: 'https://example.com/image.jpg', caption: 'Hello' }
		});
	});

	it('should return the original message if it is not interactive', () => {
		const message = { type: 'text' as 'text', text: { body: 'Hello', preview_url: false } };
		expect(removeButton(message, 0)).toBe(message);
	});
});
