import { json, error } from '$lib/server/';
import * as api from '$lib/server/api/communications/email/sends';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const templates = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(templates);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends:GET01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const createdTemplate = await api.create({
			instanceId: event.locals.instance.id,
			defaultTemplateId: event.locals.instance.settings.communications.email.default_template_id,
			t: event.locals.t,
			adminId: event.locals.admin.id,
			queue: event.locals.queue,
			body
		});
		return json(createdTemplate);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/communications/emails/sends:POST01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
