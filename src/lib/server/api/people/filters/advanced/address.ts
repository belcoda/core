import { format } from 'node-pg-format';
import { sqlWildcardify } from '$lib/server/utils/db/utility';
export function filter({ instanceId, searchString }: { instanceId: number; searchString: string }) {
	const search = sqlWildcardify(searchString);
	const query = format(
		`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND concat(address_line_1, ' ', address_line_2, ' ', ' ', address_line_3, ' ', address_line_4) ILIKE %L)`,
		instanceId,
		search
	);

	return query;
}
