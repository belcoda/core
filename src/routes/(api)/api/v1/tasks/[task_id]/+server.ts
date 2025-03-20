import { error, json } from '$lib/server';
import * as api from '$lib/server/api/core/tasks';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const task = await api.update({
			instanceId: event.locals.instance.id,
			taskId: Number(event.params.task_id),
			adminId: event.locals.admin.id,
			body: body,
			t: event.locals.t
		});
		return json(task);
	} catch (err) {
		return error(500, 'API:/tasks/[task_id]:PUT:01', m.spry_ago_baboon_cure(), err);
	}
}
