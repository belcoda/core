import { format } from 'node-pg-format';
import { sqlWildcardify } from '$lib/server/utils/db/utility';
export function filter({
	instanceId,
	searchString,
	partial,
	mustBeSubscribed
}: {
	instanceId: number;
	searchString: string;
	partial: boolean;
	mustBeSubscribed: boolean;
}) {
	const search = partial ? sqlWildcardify(searchString) : searchString;
	const subscribed = mustBeSubscribed ? ` AND email->>'subscribed' = true` : '';
	const query = format(
		`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND email->>'email' ILIKE %L)${subscribed}`,
		instanceId,
		search
	);

	return query;
}
