import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/communications/email/templates';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const readTemplate = await api.read({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			templateId: Number(event.params.template_id)
		});
		return json(readTemplate);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/templates/[template_id]:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function PUT(event) {
	try {
		const body = await event.request.json();
		const updatedTemplate = await api.update({
			instanceId: event.locals.instance.id,
			t: event.locals.t,
			templateId: Number(event.params.template_id),
			body
		});
		return json(updatedTemplate);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/templates/[template_id]:PUT01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
