import { format } from 'node-pg-format';
import { type AttendeeStatus } from '$lib/schema/events/attendees';

export function filter({
	instanceId,
	eventId,
	status
}: {
	instanceId: number;
	eventId: number;
	status: AttendeeStatus | 'any';
}) {
	if (status === 'any') {
		const query = format(
			`(SELECT id FROM people.people WHERE instance_id = %L AND id IN (select person_id from events.attendees where event_id = %L))`,
			instanceId,
			eventId
		);
		return query;
	} else {
		const query = format(
			`(SELECT id FROM people.people WHERE instance_id = %L AND id IN (select person_id from events.attendees where event_id = %L AND status = %L))`,
			instanceId,
			eventId,
			status
		);
		return query;
	}
}
