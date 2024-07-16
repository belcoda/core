import { json, BelcodaError, pino, error } from '$lib/server';
import * as api from '$lib/server/api/events/events';
import * as schema from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
const log = pino('API:/api/v1/events/+server.ts');
export async function GET(event) {
	try {
		const response = await api.list({
			instanceId: event.locals.instance.id,
			url: event.url,
			t: event.locals.t
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events:GET', event.locals.t.errors.http[500](), err);
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
			defaultTemplateId: event.locals.instance.settings.events.default_template_id,
			defaultEmailTemplateId: event.locals.instance.settings.events.default_email_template_id
		});
		return json(response);
	} catch (err) {
		return error(500, 'API:/api/v1/events:POST', event.locals.t.errors.http[500](), err);
	}
}
