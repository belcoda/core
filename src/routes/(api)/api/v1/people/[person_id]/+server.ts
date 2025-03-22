import { error, json } from '$lib/server/';
import * as api from '$lib/server/api/people/people';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const person = await api.read({
			instance_id: event.locals.instance.id,
			person_id: Number(event.params.person_id),
			t: event.locals.t,
			url: event.url
		});
		return json(person);
	} catch (err) {
		return error(500, 'API:/people/:person_id:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function PUT(event) {
	try {
		const updatedPerson = await api.update({
			instance_id: event.locals.instance.id,
			person_id: Number(event.params.person_id),
			body: await event.request.json(),
			admin_id: event.locals.admin.id,
			t: event.locals.t,
			queue: event.locals.queue
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: Number(event.params.person_id),
			adminId: event.locals.admin.id,
			details: {
				type: 'user_details_updated',
				method: 'manual'
			},
			queue: event.locals.queue
		});
		return json(updatedPerson);
	} catch (err) {
		return error(500, 'API:/people/:person_id:PUT:01', m.spry_ago_baboon_cure(), err);
	}
}
