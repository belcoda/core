import { json, error } from '$lib/server';
import * as api from '$lib/server/api/petitions/taggings';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const listData = await api.list({
			instanceId: event.locals.instance.id,
			petitionId: Number(event.params.petition_id),
			t: event.locals.t
		});
		return json(listData);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/petitions/[petition_id]/tags:GET',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
