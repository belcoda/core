import { parse } from '$lib/schema/valibot';

import {
	read as readThread,
	type Read as ReadThread
} from '$lib/schema/communications/whatsapp/threads';

import {
	list as messageListSchema,
	type List as MessageList
} from '$lib/schema/communications/whatsapp/messages';

export async function fetchMessages(threadId: number): Promise<MessageList['items']> {
	const res = await fetch(`/api/v1/communications/whatsapp/threads/${threadId}/messages`);
	const body = await res.json();
	const parsed = parse(messageListSchema, body);
	const messages = parsed.items;
	return messages;
}

export async function changeThreadTemplate({
	threadId,
	templateId
}: {
	threadId: number;
	templateId: number;
}): Promise<ReadThread> {
	const res = await fetch(`/api/v1/communications/whatsapp/threads/${threadId}`, {
		method: 'PUT',
		body: JSON.stringify({
			template_id: templateId
		})
	});
	if (!res.ok) {
		console.error('Failed to update thread', res);
	}
	const parsed = parse(readThread, await res.json());
	return parsed;
}

import {
	type Update as UpdateMessage,
	update as updateMessage,
	type Read as ReadMessage,
	read as readMessage
} from '$lib/schema/communications/whatsapp/messages';
import { type Template as TemplateForComponents } from '$lib/schema/communications/whatsapp/elements/template_message';

export async function updateThread({
	templateMessage,
	messageId,
	actions,
	templateName,
	components,
	templateId,
	threadId
}: {
	templateMessage: UpdateMessage['message'];
	messageId: string;
	templateName: string;
	actions: UpdateMessage['actions'];
	components: TemplateForComponents['components'];
	templateId: number;
	threadId: number;
}): Promise<ReadMessage> {
	if (templateMessage && templateMessage.type === 'template') {
		const updateThreadBody: UpdateMessage = {
			actions: actions,
			message: {
				...templateMessage,
				template: {
					...templateMessage.template,
					name: templateName,
					components: components
				}
			}
		};

		const threadResponse = await fetch(`/api/v1/communications/whatsapp/threads/${threadId}`, {
			method: 'PUT',
			body: JSON.stringify({
				template_id: templateId
			})
		});
		if (!threadResponse.ok) {
			throw new Error('Failed to update thread');
		}
		const parsedThread = parse(readThread, await threadResponse.json());

		const parsedUpdateThreadBody = parse(updateMessage, updateThreadBody);
		const messageRes = await fetch(`/api/v1/communications/whatsapp/messages/${messageId}`, {
			method: 'PUT',
			body: JSON.stringify(parsedUpdateThreadBody)
		});
		if (!messageRes.ok) {
			throw new Error('Failed to update message');
		}
		const parsed = parse(readMessage, await messageRes.json());

		return parsed;
	} else {
		throw new Error('Invalid message type');
	}
}
