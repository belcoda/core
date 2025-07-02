import * as m from '$lib/paraglide/messages';
import { type Update, update, read } from '$lib/schema/communications/email/messages';
import { read as readSend } from '$lib/schema/communications/email/sends';
import { type Create } from '$lib/schema/communications/email/sends';
import { parseAsync } from '$lib/schema/valibot';

export default async function ({
	message,
	messageId,
	listId
}: {
	message: Update;
	messageId: number;
	listId: number | undefined;
}): Promise<void> {
	//first save the email
	if (!listId) {
		throw new Error(m.topical_tasty_deer_play());
	}

	const parsedUpdate = await parseAsync(update, message).catch(() => {
		throw new Error(m.clean_tense_eel_jump());
	});
	const resultUpdate = await fetch(`/api/v1/communications/email/messages/${messageId}`, {
		method: 'PUT',
		body: JSON.stringify(parsedUpdate)
	});
	if (!resultUpdate.ok) {
		throw new Error(m.blue_petty_jackdaw_beam());
	}
	const updatedMessage = await resultUpdate.json();
	const parsedUpdated = await parseAsync(read, updatedMessage);

	//now send
	const body: Create = {
		list_id: listId,
		message_id: parsedUpdated.id,
		name: `${parsedUpdated.name} - ${new Date().getTime()}`
	};
	const result = await fetch(`/api/v1/communications/email/messages/${messageId}/sends`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!result.ok) {
		throw new Error(m.real_front_finch_emerge());
	}

	const createdSend = await result.json();
	const parsedSend = await parseAsync(readSend, createdSend);

	const sendRequest = await fetch(
		`/api/v1/communications/email/messages/${messageId}/sends/${parsedSend.id}/send`,
		{
			method: 'PUT',
			body: JSON.stringify({
				list_id: parsedSend.list_id
			})
		}
	);
	if (!sendRequest.ok) {
		throw new Error(m.fuzzy_petty_anteater_exhale());
	}
}
