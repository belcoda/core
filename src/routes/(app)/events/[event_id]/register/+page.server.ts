import {
	superValidate,
	message,
	valibot,
	filter,
	redirect,
	type Infer,
	pino,
	BelcodaError,
	returnMessage,
	loadError
} from '$lib/server';

import { list } from '$lib/schema/people/people';
import { list as listForEvent, create } from '$lib/schema/events/attendees';
import { parse } from '$lib/schema/valibot';

import { read } from '$lib/schema/events/events';

const log = pino(import.meta.url);
export async function load(event) {
	//event.url.searchParams.append('isRegisteredForEvent', event.params.event_id);
	const url = new URL(event.url);
	url.searchParams.append('isNotRegisteredForEvent', event.params.event_id);
	const response = await event.fetch(filter(`/api/v1/people`, url));
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(list, body);

	const eventResponse = await event.fetch(`/api/v1/events/${event.params.event_id}`);
	if (!eventResponse.ok) return loadError(eventResponse);
	const eventBody = await eventResponse.json();
	const eventParsed = parse(read, eventBody);

	const attendeesResponse = await event.fetch(`/api/v1/events/${event.params.event_id}/attendees`);
	if (!attendeesResponse.ok) return loadError(attendeesResponse);
	const attendeesBody = await attendeesResponse.json();
	const attendees = parse(listForEvent, attendeesBody);

	return {
		event: parsed,
		attendees: attendees,
		people: parsed,
		pageTitle: [{ key: 'EVENTNAME', title: eventParsed.name }]
	};
}

export const actions = {
	default: async function (event) {
		const body = await event.request.formData();
		const event_id = event.params.event_id;
		const attendee = {
			person_id: Number(body.get('person_id')),
			status: body.get('status'),
			send_notifications: Boolean(body.get('send_notifications'))
		};
		const parsed = parse(create, attendee);
		const response = await event.fetch(`/api/v1/events/${event_id}/attendees`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(parsed)
		});
		if (!response.ok) return loadError(response);
		const responseBody = await response.json();
		return redirect(event, {
			location: `/events/${event_id}/register`,
			message: event.locals.t.forms.actions.created()
		});
	}
};
