import { error, json } from '$lib/server/';
import * as schema from '$lib/schema/people/people';
import * as api from '$lib/server/api/people/people';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import { list as listAllRegisteredForEvent } from '$lib/server/api/people/filters/registered_for_event';
import { list as listAllNotRegisteredForEvent } from '$lib/server/api/people/filters/not_registered_for_event';
export async function POST(event) {
	try {
		const method = event.url.searchParams.get('method') === 'import' ? 'import' : 'manual';
		const body = await event.request.json();
		const parsed = v.parse(v.looseObject({ ...schema.create.entries }), body); //because we want to allow custom fields to be passed through to the function
		const created = await api.create({
			instance_id: event.locals.instance.id,
			body: parsed,
			t: event.locals.t,
			queue: event.locals.queue,
			method: method
		});
		return json(created);
	} catch (err) {
		return error(500, 'API:/people:POST:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function GET(event) {
	try {
		if (event.url.searchParams.get('isRegisteredForEvent')) {
			const id = Number(event.url.searchParams.get('isRegisteredForEvent'));
			const list = await listAllRegisteredForEvent({
				instance_id: event.locals.instance.id,
				eventId: id,
				url: event.url,
				status: 'any',
				t: event.locals.t
			});
			return json(list);
		}
		if (event.url.searchParams.get('isNotRegisteredForEvent')) {
			const id = Number(event.url.searchParams.get('isNotRegisteredForEvent'));
			const list = await listAllNotRegisteredForEvent({
				instance_id: event.locals.instance.id,
				eventId: id,
				url: event.url,
				status: 'any',
				t: event.locals.t
			});
			return json(list);
		}

		const list = await api.list({
			instance_id: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(list);
	} catch (err) {
		return error(500, 'API:/people:GET:01', m.spry_ago_baboon_cure(), err);
	}
}
