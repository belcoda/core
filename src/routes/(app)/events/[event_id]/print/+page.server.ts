import {
	superValidate,
	message,
	valibot,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { read } from '$lib/schema/events/events';
import { list as listForEvent, update as updateAttendee } from '$lib/schema/events/attendees';
import { unsafeListAllForEvent } from '$lib/server/api/events/attendees.js';
import { parse } from '$lib/schema/valibot';
const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!response.ok) return loadError(response);
	const eventBody = await response.json();
	const parsedEvent = parse(read, eventBody);

	// this is using an unsafe function which we don't need or want to expose through the public API.
	// if someone wanted to replicate this functionality using the public API, they could do so via pagination.
	const attendees = await unsafeListAllForEvent({
		instanceId: event.locals.instance.id,
		eventId: Number(event.params.event_id)
	});

	return {
		event: parsedEvent,
		attendees: attendees,
		pageTitle: [{ key: 'EVENTNAME', title: parsedEvent.name }]
	};
}
