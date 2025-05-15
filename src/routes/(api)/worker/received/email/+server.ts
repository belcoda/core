import { json, error } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { incomingPostmarkWebhook } from '$lib/schema/communications/email/received_emails';
import { create as createReceivedMessage } from '$lib/server/api/communications/email/received_emails';
import { getIdsFromEmailPhoneNumber, read as readPerson } from '$lib/server/api/people/people';
import { type Create as CreateInteraction } from '$lib/schema/people/interactions';

import type { RequestEvent } from './$types';
export async function POST(event: RequestEvent) {
	try {
		const body = await event.request.json();
		const parsed = parse(incomingPostmarkWebhook, body);
		const peopleIds = await getIdsFromEmailPhoneNumber({
			instanceId: event.locals.instance.id,
			email: parsed.From
		});
		if (peopleIds.length !== 1) {
			return error(400, 'WORKER:/received/email:POST:02', 'Unable to find person for email.');
		}
		const personId = peopleIds[0];
		const receivedMessage = await createReceivedMessage({
			instanceId: event.locals.instance.id,
			body: {
				person_id: personId,
				subject: parsed.Subject || '[NO_SUBJECT]',
				message_id: null,
				message: parsed.StrippedTextReply || parsed.TextBody || parsed.HtmlBody || '[NO_BODY]'
			}
		});
		const person = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: personId,
			url: event.url
		});
		const interaction: CreateInteraction = {
			person_id: personId,
			admin_id: person.point_person.id,
			details: {
				type: 'email_inbound',
				subject: parsed.Subject || '[NO_SUBJECT]',
				message: parsed.StrippedTextReply || parsed.TextBody || parsed.HtmlBody || '[NO_BODY]'
			}
		};
		await event.locals.queue(
			'/utils/people/record_interaction',
			event.locals.instance.id,
			interaction,
			person.point_person.id
		);
		return json(receivedMessage);
	} catch (err) {
		return error(500, 'WORKER:/received/email:POST:01', 'Unable to parse email correctly.', err);
	}
}
