import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/groups';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const bannedParamSet = event.url.searchParams.get('showBanned');
		const banned = bannedParamSet === 'true';
		const list = await api.read({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			url: event.url,
			banned
		});
		return json(list);
	} catch (err) {
		return error(500, 'API:/people/groups/[group_id]:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const group = await api.update({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			body: body,
			url: event.url
		});
		return json(group, { status: 201 });
	} catch (err) {
		return error(500, 'API:/people/groups/[group_id]:PUT:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function DELETE(event) {
	try {
		const group = await api.del({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id)
		});
		return json(group, { status: 200 });
	} catch (err) {
		return error(500, 'API:/people/groups/[group_id]:DELETE:01', m.spry_ago_baboon_cure(), err);
	}
}
