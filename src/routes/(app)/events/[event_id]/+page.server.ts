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

	return {
		event: parsedEvent,
		attendees: attendees,
		pageTitle: [{ key: 'EVENTNAME', title: parsedEvent.name }]
	};
}

export const actions = {
	default: async function (event) {
		const body = await event.request.formData();
		const bodyObject = Object.fromEntries(body.entries());
		const personId = Number(bodyObject.person_id);
		const toParse = {
			status: bodyObject.status,
			send_notifications: bodyObject.send_notifications === 'true' ? true : false
		};
		log.debug({ personId, toParse });
		const parsed = parse(updateAttendee, toParse);
		log.debug({ parsed });

		const response = await event.fetch(
			`/api/v1/events/${event.params.event_id}/attendees/${personId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parsed)
			}
		);
		if (!response.ok) return loadError(response);
		return redirect(event, {
			location: `/events/${event.params.event_id}`,
			message: event.locals.t.forms.actions.saved()
		});
	}
};
