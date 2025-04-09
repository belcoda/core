import { format } from 'node-pg-format';
import { sqlWildcardify } from '$lib/server/utils/db/utility';
export function filter({
	instanceId,
	searchString,
	partial,
	mustBeSubscribed,
	mustBeWhatsapp
}: {
	instanceId: number;
	searchString: string;
	partial: boolean;
	mustBeSubscribed: boolean;
	mustBeWhatsapp: boolean;
}) {
	const search = partial ? sqlWildcardify(searchString) : searchString;
	const subscribed = mustBeSubscribed ? ` AND phone_number->>'subscribed' = true` : '';
	const whatsapp = mustBeWhatsapp ? ` AND phone_number->>'whatsapp' = true` : '';
	const query = format(
		`(SELECT id FROM people.people WHERE instance_id = %L AND deleted_at IS NULL AND phone_number->>'phone_number' ILIKE %L)${subscribed}${whatsapp}`,
		instanceId,
		search
	);

	return query;
}
