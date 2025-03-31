import { json } from '@sveltejs/kit';
import { error, pino } from '$lib/server';
import * as schema from '$lib/schema/core/admin';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import * as api from '$lib/server/api/core/admins';

const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(schema.create, body);
		const created = await api.create({
			instance_id: event.locals.instance.id,
			body: parsed,
			adminId: event.locals.admin.id,
			queue: event.locals.queue
		});
		return json(created, { status: 201 });
	} catch (err) {
		return error(500, 'API01:/ADMINS:POST:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function GET(event) {
	try {
		const list = await api.list({ instance_id: event.locals.instance.id, url: event.url });
		return json(list);
	} catch (err) {
		return error(500, 'API01:/ADMINS:GET:01', m.spry_ago_baboon_cure(), err);
	}
}
