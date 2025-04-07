import { BelcodaError, json, error, pino } from '$lib/server';
import { signatureQueueMessage } from '$lib/schema/petitions/petitions';
import { parse } from '$lib/schema/valibot';
import updatePerson from '$lib/server/hooks/website/utils/update_person';
import { create } from '$lib/server/api/petitions/signatures';
import { read as readPetition } from '$lib/server/api/petitions/petitions';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';

const log = pino(import.meta.url);
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(signatureQueueMessage, body);
		const petition = await readPetition({
			instanceId: event.locals.instance.id,
			petitionId: parsed.petition_id,
			t: event.locals.t
		});
		const person = await updatePerson({
			instanceId: event.locals.instance.id,
			signup: parsed.signup,
			adminId: event.locals.admin.id,
			country: event.locals.instance.country,
			t: event.locals.t,
			type: {
				method: 'petition_signature',
				petition_id: parsed.petition_id,
				petition_name: petition.name
			},
			queue: event.locals.queue
		}).catch((err) => {
			throw new BelcodaError(
				400,
				'WORKER:/petitions/signature:01',
				m.teary_dizzy_earthworm_urge(),
				err
			);
		});

		await create({
			instanceId: event.locals.instance.id,
			petitionId: parsed.petition_id,
			queue: event.locals.queue,
			body: {
				person_id: person.id,
				send_autoresponse: true
			},
			t: event.locals.t
		});
		await queueInteraction({
			personId: person.id,
			adminId: event.locals.admin.id,
			instanceId: event.locals.instance.id,
			details: {
				type: 'signed_petition',
				method: 'website',
				petition_id: parsed.petition_id,
				petition_name: petition.name
			},
			queue: event.locals.queue
		});

		return json({ success: true });
	} catch (err) {
		return error(500, 'WORKER:/petitions/signature:02', m.teary_dizzy_earthworm_urge(), err);
	}
}
