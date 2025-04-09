import { format } from 'node-pg-format';
export function filter({ instanceId, listId }: { instanceId: number; listId: number }) {
	const query = format(
		`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND id IN (select person_id from people.list_people where list_id = %L))`,
		instanceId,
		listId
	);

	return query;
}
