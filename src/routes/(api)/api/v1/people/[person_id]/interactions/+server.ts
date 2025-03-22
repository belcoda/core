import { json, error } from '$lib/server';
import { list, create } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const interactions = await list({
			instanceId: event.locals.instance.id,
			personId: Number(event.params.person_id),
			url: event.url
		});
		return json(interactions);
	} catch (err) {
		return error(500, 'API:/people/:person_id/interactions:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const interactions = await create({
			instanceId: event.locals.instance.id,
			body,
			t: event.locals.t
		});
		return json(interactions);
	} catch (err) {
		return error(500, 'API:/people/:person_id/interactions:POST:01', m.spry_ago_baboon_cure(), err);
	}
}
