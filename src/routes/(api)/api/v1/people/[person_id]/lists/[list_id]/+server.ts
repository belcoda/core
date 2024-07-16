import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/lists';
import { read as readList } from '$lib/server/api/people/lists';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
export async function POST(event) {
	try {
		const listId = Number(event.params.list_id);
		const personId = Number(event.params.person_id);
		const list = await api.addPersonToList({
			instanceId: event.locals.instance.id,
			personId,
			listId,
			t: event.locals.t
		});
		const listObject = await readList({
			instanceId: event.locals.instance.id,
			listId,
			t: event.locals.t
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId,
			adminId: event.locals.admin.id,
			details: {
				type: 'added_to_list',
				list_id: listObject.id,
				list_name: listObject.name
			},
			queue: event.locals.queue
		});
		return json(list, { status: 201 });
	} catch (err) {
		return error(
			500,
			'API:/api/v1/people/[person_id]/lists/[list_id]:POST',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const personId = Number(event.params.person_id);
		const listId = Number(event.params.list_id);
		const deleted = await api.removePersonFromList({
			instanceId: event.locals.instance.id,
			personId,
			listId,
			t: event.locals.t
		});
		const listObject = await readList({
			instanceId: event.locals.instance.id,
			listId,
			t: event.locals.t
		});
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId,
			adminId: event.locals.admin.id,
			details: {
				type: 'removed_from_list',
				list_id: listObject.id,
				list_name: listObject.name
			},
			queue: event.locals.queue
		});
		return json(deleted);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/people/[person_id]/lists/[list_id]:DELETE',
			event.locals.t.errors.http[500](),
			err
		);
	}
}
