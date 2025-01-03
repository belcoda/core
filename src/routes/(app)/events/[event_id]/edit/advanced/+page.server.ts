import { read as readEvent, update as updateEvent } from '$lib/schema/events/events';
import { parse } from '$lib/schema/valibot';
import { superValidate, valibot } from '$lib/server';
export async function load(event) {
	const result = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	const json = await result.json();
	const parsed = parse(readEvent, json);
	const form = await superValidate(parsed, valibot(updateEvent));
	return { form, event: parsed };
}
