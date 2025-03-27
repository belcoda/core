import { error, json } from '$lib/server';
import * as api from '$lib/server/api/core/tasks';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const task = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			adminId: event.locals.admin.id
		});
		return json(task);
	} catch (err) {
		return error(500, 'API:/tasks:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const task = await api.create({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			adminId: event.locals.admin.id,
			body: body
		});
		return json(task);
	} catch (err) {
		return error(500, 'API:/tasks:POST:01', m.spry_ago_baboon_cure(), err);
	}
}
