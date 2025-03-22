import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/groups';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import { read as readGroup } from '$lib/server/api/people/groups';
import * as m from '$lib/paraglide/messages';
export async function POST(event) {
	try {
		const body = await event.request.json();
		const groupMember = await api.addMember({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			t: event.locals.t,
			body
		});
		const group = await readGroup({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			t: event.locals.t,
			url: event.url
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: groupMember.person_id,
			adminId: event.locals.admin.id,
			details: {
				type: 'added_to_group',
				group_id: group.id,
				group_name: group.name
			},
			queue: event.locals.queue
		});
		return json(groupMember);
	} catch (err) {
		return error(500, 'API:/people/groups:GET:01', m.spry_ago_baboon_cure(), err);
	}
}
