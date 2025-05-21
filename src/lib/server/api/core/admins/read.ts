import { redisString } from '$lib/server/api/core/admins/cache.js';
import * as redis from '$lib/server/utils/redis.js';
import { db, pool } from '$lib/server/utils/db/index.js';
import { v } from '$lib/schema/valibot.js';
import * as schema from '$lib/schema/core/admin.js';
import { BelcodaError } from '$lib/server/utils/error/BelcodaError.js';
import * as m from '$lib/paraglide/messages.js';
export async function read({
	instance_id,
	t,
	admin_id,
	includeDeleted = false
}: {
	instance_id: number;
	t: App.Localization;
	admin_id: number;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	if (!includeDeleted) {
		const cached = await redis.get(redisString(instance_id, admin_id));
		if (cached) return v.parse(schema.read, cached);
	}
	const response = await db
		.selectExactlyOne('admins', {
			instance_id,
			id: admin_id,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool)
		.catch((err: Error) => {
			throw new BelcodaError(404, 'DATA:CORE:ADMINS:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResponse = v.parse(schema.read, response);
	await redis.set(redisString(instance_id, admin_id), parsedResponse);

	return parsedResponse;
}
