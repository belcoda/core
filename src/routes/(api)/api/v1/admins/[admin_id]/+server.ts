import { error, json } from '$lib/server/';
import * as schema from '$lib/schema/core/admin';
import * as api from '$lib/server/api/core/admins';
import { parse } from '$lib/schema/valibot';

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.update, body);
		const updated = await api.update({
			instance_id: event.locals.instance.id,
			t: event.locals.t,
			admin_id: Number(event.params.admin_id),
			body: parsed
		});
		return json(updated);
	} catch (err) {
		return error(500, 'API:/ADMINS:PUT:01', event.locals.t.errors.http[500](), err);
	}
}

export async function GET(event) {
	try {
		const read = await api.read({
			instance_id: event.locals.instance.id,
			t: event.locals.t,
			admin_id: Number(event.params.admin_id)
		});
		return json(read);
	} catch (err) {
		return error(500, 'API:/ADMINS:GET:01', event.locals.t.errors.http[500](), err);
	}
}

export async function DELETE(event) {
	try {
		await api.del({
			instance_id: event.locals.instance.id,
			admin_id: Number(event.params.admin_id),
			currentlySignedInAdminId: event.locals.admin.id,
			t: event.locals.t,
			queue: event.locals.queue
		});
		return json({ success: true });
	} catch (err) {
		return error(500, 'API:/admins/[admin_id]:DELETE:01', event.locals.t.errors.http[500](), err);
	}
}
