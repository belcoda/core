import { json, BelcodaError, pino, error } from '$lib/server';
import * as api from '$lib/server/api/events/events';
import * as schema from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);
export async function GET(event) {
	try {
		const response = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events:GET', m.spry_ago_baboon_cure(), err);
	}
}

export async function POST(event) {
	try {
		const body = await event.request.json();
		log.debug(body);
		const parsed = parse(schema.create, body);
		const response = await api.create({
			instanceId: event.locals.instance.id,
			body: parsed,
			t: event.locals.t,
			adminId: event.locals.admin.id,
			defaultEmailTemplateId: event.locals.instance.settings.events.default_email_template_id,
			queue: event.locals.queue
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events:POST', m.spry_ago_baboon_cure(), err);
	}
}
