import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/groups';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import { read as readGroup } from '$lib/server/api/people/groups';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const list = await api.updateMember({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			t: event.locals.t,
			personId: Number(event.params.person_id),
			body
		});
		return json(list);
	} catch (err) {
		return error(
			500,
			'API:/people/groups/members/[person_id]:PUT:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const groupMember = await api.removeMember({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			t: event.locals.t,
			personId: Number(event.params.person_id)
		});
		const group = await readGroup({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			t: event.locals.t,
			url: event.url
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId: Number(event.params.person_id),
			adminId: event.locals.admin.id,
			details: {
				type: 'removed_from_group',
				group_id: group.id,
				group_name: group.name
			},
			queue: event.locals.queue
		});
		return json(groupMember);
	} catch (err) {
		return error(
			500,
			'API:/people/groups/members/[person_id]:DELETE:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
