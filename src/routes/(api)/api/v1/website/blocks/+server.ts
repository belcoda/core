import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/website/blocks';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const blocks = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(blocks);
	} catch (err) {
		return error(500, 'API:/api/v1/website/blocks:GET01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const createdBlock = await api.create({
			instanceId: event.locals.instance.id,
			body
		});
		return json(createdBlock);
	} catch (err) {
		return error(500, 'API:/api/v1/website/blocks:POST01', m.spry_ago_baboon_cure(), err);
	}
}
