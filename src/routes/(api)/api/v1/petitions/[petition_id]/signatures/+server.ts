import { json, error, pino } from '$lib/server';
import * as api from '$lib/server/api/petitions/signatures';
import * as schema from '$lib/schema/petitions/signatures';
import { parse } from '$lib/schema/valibot';
import { read as readPetition } from '$lib/server/api/petitions/petitions';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);
export async function GET(event) {
	try {
		const response = await api.listForPetition({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			url: event.url,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/petitions/[petition_id]/signatures:GET',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.create, body);
		const response = await api.create({
			instanceId: event.locals.instance.id,
			body: parsed,
			t: event.locals.t,
			petitionId: Number(event.params.petition_id),
			queue: event.locals.queue
		});
		const petition = await readPetition({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			t: event.locals.t
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: response.person_id,
			adminId: event.locals.admin.id,
			details: {
				type: 'signed_petition',
				method: 'manual',
				petition_id: petition.id,
				petition_name: petition.name
			},
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/petitions/[petition_id]/signatures:POST',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
