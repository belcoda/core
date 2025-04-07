import { json, error } from '$lib/server';
import { list } from '$lib/server/api/communications/whatsapp/received_whatsapp_group_messages';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const listed = await list({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			url: event.url,
			t: event.locals.t
		});
		return json(listed);
	} catch (err) {
		return error(
			500,
			'API:/people/groups/[group_id]/whatsapp/messages:GET:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
