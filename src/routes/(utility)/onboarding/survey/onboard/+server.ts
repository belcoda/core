import { json, error } from '$lib/server';
import { validationSchema } from '../form.svelte.js';
import { parse } from '$lib/schema/valibot';
export async function POST(event) {
	try {
		const parsedBody = parse(validationSchema, await event.request.json());
		return json({});
	} catch (err) {
		return error(500, 'API:/api/v1/events/[event_id]:GET', 'Unable to create account', err);
	}
}
