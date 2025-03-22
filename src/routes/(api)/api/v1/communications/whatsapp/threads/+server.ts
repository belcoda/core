import { error, json } from '$lib/server';
import * as api from '$lib/server/api/communications/whatsapp/threads';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const result = await api.list({ instanceId: event.locals.instance.id, url: event.url });
		return json(result);
	} catch (err) {
		return error(500, 'API:/communications/whatsapp/threads:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		const result = await api.create({
			instanceId: event.locals.instance.id,
			body: body,
			adminId: event.locals.admin.id,
			t: event.locals.t,
			instanceLanguage: event.locals.instance.language,
			defaultTemplateId: event.locals.instance.settings.communications.whatsapp.default_template_id
		});
		return json(result);
	} catch (err) {
		return error(500, 'API:/communications/whatsapp/threads:POST', m.spry_ago_baboon_cure(), err);
	}
}
