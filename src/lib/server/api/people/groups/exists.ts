import { redisString } from '$lib/server/api/people/groups/cache.js';
import * as redis from '$lib/server/utils/redis.js';
import { db, pool } from '$lib/server/utils/db/index.js';
import { BelcodaError } from '$lib/server/utils/error/BelcodaError.js';
import * as m from '$lib/paraglide/messages.js';
export async function exists({ instanceId, groupId }: { instanceId: number; groupId: number }) {
	const cached = await redis.get(redisString(instanceId, groupId));
	if (cached) return true;
	await db
		.selectExactlyOne('people.groups', {
			instance_id: instanceId,
			id: groupId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:PEOPLE:GROUPS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
	return true;
}
