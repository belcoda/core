import * as m from '$lib/paraglide/messages';
import {
	type Update,
	update,
	read,
	type SendTestEmail
} from '$lib/schema/communications/email/messages';
import { parseAsync, email as emailSchema } from '$lib/schema/valibot';

export default async function ({
	message,
	messageId,
	email
}: {
	message: Update;
	messageId: number;
	email: string | undefined;
}): Promise<void> {
	const parsedEmail = await parseAsync(emailSchema, email).catch(() => {
		throw new Error(m.alert_flaky_lizard_fade());
	});

	//first save the email
	const parsedUpdate = await parseAsync(update, message).catch(() => {
		throw new Error(m.tame_male_cheetah_blend());
	});
	const resultUpdate = await fetch(`/api/v1/communications/email/messages/${messageId}`, {
		method: 'PUT',
		body: JSON.stringify(parsedUpdate)
	});
	if (!resultUpdate.ok) {
		throw new Error(m.key_steep_lamb_persist());
	}
	const updatedMessage = await resultUpdate.json();
	const parsedUpdated = await parseAsync(read, updatedMessage);

	//now send
	const body: SendTestEmail = {
		email: parsedEmail,
		message: parsedUpdated,
		context: {}
	};
	const result = await fetch(`/api/v1/communications/email/messages/${messageId}/test`, {
		method: 'PUT',
		body: JSON.stringify(body)
	});
	if (!result.ok) {
		throw new Error(m.witty_nice_warbler_rush());
	}
}
