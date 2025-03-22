import { error, json } from '$lib/server/';
import * as api from '$lib/server/api/core/admins';
import * as m from '$lib/paraglide/messages';

export async function GET(event) {
	try {
		const read = await api.readAdminApiKey({
			instance_id: event.locals.instance.id,
			t: event.locals.t,
			admin_id: Number(event.params.admin_id)
		});
		return json(read);
	} catch (err) {
		return error(500, 'API01:/ADMINS:GET:01', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const updatedApiKey = await api.updateApiKey({
			instance_id: event.locals.instance.id,
			t: event.locals.t,
			admin_id: Number(event.params.admin_id)
		});
		return json(updatedApiKey);
	} catch (err) {
		return error(500, 'API01:/ADMINS:POST:01', m.spry_ago_baboon_cure(), err);
	}
}
