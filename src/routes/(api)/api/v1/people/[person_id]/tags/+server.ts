import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/taggings';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const listData = await api.list({
			instanceId: event.locals.instance.id,
			personId: Number(event.params.person_id),
			t: event.locals.t
		});
		return json(listData);
	} catch (err) {
		return error(500, 'API:/api/v1/people/[person_id]/lists:GET', m.spry_ago_baboon_cure(), err);
	}
}
