import { error, json } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { linkWhatsappGroup } from '$lib/schema/people/groups';
import { linkWhatsappGroup as linkWhatsappGroupApi } from '$lib/server/api/people/groups';
import * as m from '$lib/paraglide/messages';
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(linkWhatsappGroup, body);
		const updated = await linkWhatsappGroupApi({
			instanceId: event.locals.instance.id,
			groupId: Number(event.params.group_id),
			body: parsed,
			t: event.locals.t,
			url: event.url
		});
		return json(updated);
	} catch (err) {
		return error(
			500,
			'API:/people/groups/[group_id]/whatsapp/link:PUT:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
