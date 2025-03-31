import {
	superValidate,
	message,
	valibot,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { PUBLIC_HOST } from '$env/static/public';

import { redirect } from '@sveltejs/kit';

import { update, read } from '$lib/schema/events/events';
import { list as listForEvent } from '$lib/schema/events/attendees';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!response.ok) return loadError(response);
	const eventBody = await response.json();
	const parsedEvent = parse(read, eventBody);
	const attendeesResponse = await event.fetch(`/api/v1/events/${event.params.event_id}/attendees`);
	if (!attendeesResponse.ok) return loadError(attendeesResponse);
	const attendeesBody = await attendeesResponse.json();
	const attendees = parse(listForEvent, attendeesBody);
	log.error(PUBLIC_HOST);
	const url = new URL(PUBLIC_HOST);
	log.error(
		`${url.protocol}//${event.locals.instance.slug}.${url.host}/events/${parsedEvent.slug}`
	);
	return redirect(
		301,
		`${url.protocol}//${event.locals.instance.slug}.${url.host}/events/${parsedEvent.slug}`
	);
}
