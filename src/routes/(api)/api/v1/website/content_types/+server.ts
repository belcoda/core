import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/website/content_types';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const templates = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(templates);
	} catch (err) {
		return error(500, 'API:/api/v1/website/content_types:GET01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const createdTemplate = await api.create({
			instanceId: event.locals.instance.id,
			body
		});
		return json(createdTemplate);
	} catch (err) {
		return error(500, 'API:/api/v1/website/content_types:POST01', m.spry_ago_baboon_cure(), err);
	}
}
