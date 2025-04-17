import * as api from '$lib/server/api/people/lists';
import * as schema from '$lib/schema/people/lists';
import { parse } from '$lib/schema/valibot';
import { list as readListPeople } from '$lib/server/api/people/filters/in_list';
import { json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const listId = Number(event.params.list_id);
		const instanceId = event.locals.instance.id;
		const url = new URL(event.request.url);
		const listPeople = await readListPeople({
			instance_id: instanceId,
			url,
			listId,
			t: event.locals.t
		});
		const list = await api.read({ instanceId, listId });
		const parsed = parse(schema.readListWithPeople, { people: listPeople, ...list });
		return json(parsed);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/people/[person_id]/lists/[list_id]:GET',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const listId = Number(event.params.list_id);
		const instanceId = event.locals.instance.id;
		const body = await event.request.json();
		const parsed = parse(schema.update, body);
		const list = await api.update({
			instanceId,
			listId,
			body: parsed
		});
		return json(list);
	} catch (err) {
		return error(500, 'API:/api/v1/people/lists/[list_id]:PUT', m.spry_ago_baboon_cure(), err);
	}
}

export async function DELETE(event) {
	try {
		const listId = Number(event.params.list_id);
		const instanceId = event.locals.instance.id;
		const list = await api.del({ instanceId, listId });
		return json(list);
	} catch (err) {
		return error(500, 'API:/api/v1/people/lists/[list_id]:DELETE', m.spry_ago_baboon_cure(), err);
	}
}
