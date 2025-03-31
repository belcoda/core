import { type Read } from '$lib/schema/communications/whatsapp/messages';
import { v4 as uuidv4 } from 'uuid';
export function addButton(message: Read['message']): Read['message'] {
	if (message.type === 'interactive') {
		return {
			...message,
			interactive: {
				...message.interactive,
				action: {
					buttons: message.interactive.action.buttons.concat([
						{ type: 'reply', reply: { id: uuidv4(), title: '[Button title]' } }
					])
				}
			}
		};
	} else if (message.type === 'text') {
		return {
			...message,
			type: 'interactive',
			interactive: {
				body: {
					text: message.text.body
				},
				type: 'button',
				action: {
					buttons: [{ type: 'reply', reply: { id: uuidv4(), title: '[Button title]' } }]
				}
			}
		};
	} else if (message.type === 'image') {
		return {
			...message,
			type: 'interactive',
			interactive: {
				body: {
					text: message.image.caption || ''
				},
				header: {
					type: 'image',
					image: {
						link: message.image.link
					}
				},
				type: 'button',
				action: {
					buttons: [{ type: 'reply', reply: { id: uuidv4(), title: '[Button title]' } }]
				}
			}
		};
	} else {
		return message;
	}
}

export function removeButton(message: Read['message'], buttonIndex: number): Read['message'] {
	if (message.type === 'interactive') {
		if (message.interactive.action.buttons.length === 1) {
			// it's the last button, so we need to convert to a text or image message...
			if (message.interactive.header && message.interactive.header.type === 'image') {
				return {
					type: 'image',
					image: {
						link: message.interactive.header.image.link,
						caption: message.interactive.body.text
					}
				};
			} else {
				//it's a text message
				return {
					type: 'text',
					text: {
						body: message.interactive.body.text,
						preview_url: false
					}
				};
			}
		} else {
			return {
				...message,
				interactive: {
					...message.interactive,
					action: {
						buttons: message.interactive.action.buttons.toSpliced(buttonIndex, 1)
					}
				}
			};
		}
	} else {
		return message;
	}
}
