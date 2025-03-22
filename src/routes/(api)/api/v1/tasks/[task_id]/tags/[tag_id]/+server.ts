import { json, error } from '$lib/server';
import * as api from '$lib/server/api/core/task_taggings';
import * as m from '$lib/paraglide/messages';
export async function POST(event) {
	try {
		const tagId = Number(event.params.tag_id);
		const taskId = Number(event.params.task_id);
		const list = await api.create({
			instanceId: event.locals.instance.id,
			taskId,
			adminId: event.locals.admin.id,
			tagId,
			t: event.locals.t
		});
		return json(list, { status: 201 });
	} catch (err) {
		return error(
			500,
			'API:/api/v1/tasks/[task_id]/tags/[tag_id]:POST',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const taskId = Number(event.params.task_id);
		const tagId = Number(event.params.tag_id);
		const deleted = await api.del({
			instanceId: event.locals.instance.id,
			taskId,
			tagId,
			adminId: event.locals.admin.id,
			t: event.locals.t
		});
		return json(deleted);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/tasks/[task_id]/tags/[tag_id]:DELETE',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
