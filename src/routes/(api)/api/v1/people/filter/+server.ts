import { json, error, pino } from '$lib/server';
import { filterGroup } from '$lib/schema/people/filters/filters';
import { parse } from '$lib/schema/valibot';
import { outputFilterResults } from '$lib/server/api/people/filters/filters.js';
const log = pino(import.meta.url);
export async function PUT(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(filterGroup, body);
		log.debug(parsed);
		const rows = await outputFilterResults(event.locals.instance.id, parsed, event.url);
		return json(rows);
	} catch (err) {
		return error(500, 'API:/api/v1/people/[person_id]/filters/+server.ts', 'PUT', err);
	}
}
