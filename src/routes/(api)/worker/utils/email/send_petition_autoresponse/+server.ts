import { json, error, pino } from '$lib/server';
import {
	sendEmailMessage,
	triggerPetitionMessage,
	type SendEmailMessage
} from '$lib/schema/utils/email';
import { type EmailTemplateMessage } from '$lib/schema/communications/email/messages';
import { read as readPetition } from '$lib/server/api/petitions/petitions';
import { read as readPerson } from '$lib/server/api/people/people';
const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';

import { basePetitionOptions } from '$lib/server/utils/email/context/petition';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerPetitionMessage, body);

		log.debug(parsed, 'Send autoresponse email initiated');

		const petition = await readPetition({
			instanceId: event.locals.instance.id,
			petitionId: parsed.petition_id
		});

		if (petition.send_autoresponse_email === false) {
			log.debug('No autoresponse email required');
			return json({ success: true, outcome: 'No autoresponse email required' });
		}

		const person = await readPerson({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id
		});

		const context = basePetitionOptions({
			instance: event.locals.instance,
			petition: petition,
			language: person.preferred_language || event.locals.instance.language
		});

		const sendToQueue: EmailTemplateMessage = {
			context,
			person_id: parsed.person_id,
			reply_to: null,
			template: 'transactional',
			send_details: {
				type: 'petition_signature',
				petition_id: petition.id
			}
		};
		await event.locals.queue(
			'utils/email/send_email/template',
			event.locals.instance.id,
			sendToQueue,
			event.locals.admin.id
		);

		log.debug(sendToQueue, 'Sent autoresponse email to queue with these details');

		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: person.id,
			adminId: event.locals.admin.id,
			details: {
				type: 'received_petition_autoresponse_email',
				petition_id: petition.id,
				petition_name: petition.name
			},
			queue: event.locals.queue
		});

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/send_petition_autoresponse:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}
