import {
	type Read,
	sendTestEmail as validateTestEmail,
	type SendTestEmail,
	type Update,
	update as validateUpdate
} from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import { instance } from 'valibot';
type SendTestEmailInputs = {
	successMessage: string;
	errorMessage: string;
	email: string | undefined;
	messageId: number;
	message: Read;
	updateMessage: Update;
	context: SendTestEmail['context'];
};

export async function sendTestEmail(options: SendTestEmailInputs) {
	try {
		//first save the email
		const parsedUpdate = parse(validateUpdate, options.updateMessage);
		const resultUpdate = await fetch(`/api/v1/communications/email/messages/${options.messageId}`, {
			method: 'PUT',
			body: JSON.stringify(parsedUpdate)
		});
		if (!resultUpdate.ok) {
			return { message: options.errorMessage, type: 'error' };
		}
		//then send the email
		if (options.email) {
			const body: SendTestEmail = {
				email: options.email,
				message: options.message,
				context: options.context
			};
			parse(validateTestEmail, body);
			const result = await fetch(
				`/api/v1/communications/email/messages/${options.messageId}/test`,
				{
					method: 'PUT',
					body: JSON.stringify(body)
				}
			);
			if (result.ok) {
				return { message: options.successMessage, type: 'success' };
			} else {
				return { message: options.errorMessage, type: 'error' };
			}
		} else {
			return { message: options.errorMessage, type: 'error' };
		}
	} catch (err) {
		console.log(err);
		if (err instanceof Error) {
			return { message: err.message, type: 'error' };
		} else {
			return { message: options.errorMessage, type: 'error' };
		}
	}
}
