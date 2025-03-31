import { format } from 'node-pg-format';
export function filter({
	instanceId,
	eventId,
	status
}: {
	instanceId: number;
	eventId: number;
	status: 'registered' | 'attended' | 'cancelled' | 'noshow' | 'any';
}) {
	if (status === 'any') {
		const query = format(
			`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND id NOT IN (select person_id from events.attendees where event_id = %L)`,
			instanceId,
			eventId
		);
		return query;
	} else {
		const query = format(
			`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND id NOT IN (select person_id from events.attendees where event_id = %L AND status = %L)`,
			instanceId,
			eventId,
			status
		);
		return query;
	}
}
