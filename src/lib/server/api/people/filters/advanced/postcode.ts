import { format } from 'node-pg-format';
import { sqlWildcardify } from '$lib/server/utils/db/utility';
export function filter({
	instanceId,
	searchString,
	partial
}: {
	instanceId: number;
	searchString: string;
	partial: boolean;
}) {
	const search = partial ? sqlWildcardify(searchString) : searchString;
	const query = format(
		`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND postcode ILIKE %L)`,
		instanceId,
		search
	);

	return query;
}
