import { error, redis, db, pool, pino, BelcodaError } from '$lib/server';
import * as schema from '$lib/schema/core/admin';
import { v } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
import { filterQuery } from '$lib/server/utils/filters/filter';

import type { Read as ReadInstance } from '$lib/schema/core/instance';

import { create as createSession, expireAllSessionsForAdmin } from '$lib/server/api/core/sessions';
import { read as readInstance } from '$lib/server/api/core/instances';

const log = pino(import.meta.url);
import * as m from '$lib/paraglide/messages';

const redisString = (instance_id: number, admin_id: number | 'all') =>
	`i:${instance_id}:admin:${admin_id}`;

export async function exists({
	instanceId,
	adminId,
	t,
	includeDeleted = false
}: {
	instanceId: number;
	adminId: number;
	t: App.Localization;
	includeDeleted?: boolean;
}): Promise<true> {
	const cached = await redis.get(redisString(instanceId, adminId));
	if (cached) return true;
	await db
		.selectExactlyOne('admins', {
			instance_id: instanceId,
			id: adminId,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool)
		.catch((err) => {
			return new BelcodaError(404, 'DATA:CORE:ADMINS:EXISTS:01', m.pretty_tired_fly_lead(), err);
		});
	return true;
}

export async function create({
	instance_id,
	body,
	adminId,
	queue
}: {
	instance_id: number;
	body: schema.Create;
	adminId?: number;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = v.parse(schema.create, body);
	const toCreate = {
		instance_id,
		...parsed
	};
	const created = await db.insert('admins', toCreate).run(pool);
	const createdParsed = v.parse(schema.read, created);
	await redis.set(redisString(instance_id, createdParsed.id), createdParsed);
	await redis.del(redisString(instance_id, 'all'));
	if (adminId) {
		await queue('utils/people/match_sanction', instance_id, { adminId: createdParsed.id }, adminId);
	}
	return createdParsed;
}

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

export async function update({
	instance_id,
	admin_id,
	t,
	body,
	includeDeleted = false
}: {
	instance_id: number;
	admin_id: number;
	t: App.Localization;
	body: schema.Update;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const parsed = v.parse(schema.update, body);
	const response = await db
		.update('admins', parsed, {
			instance_id,
			id: admin_id,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool);
	if (response.length !== 1) {
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:UPDATE:01', m.teary_dizzy_earthworm_urge());
	}
	const parsedResponse = v.parse(schema.read, response[0]);
	await redis.set(redisString(instance_id, admin_id), parsedResponse);
	await redis.del(redisString(instance_id, 'all'));
	return parsedResponse;
}

export async function signIn({
	t,
	body
}: {
	t: App.Localization;
	body: schema.SignIn;
}): Promise<{ admin: schema.Read; session: string }> {
	const parsed = v.parse(schema.signIn, body);
	const toUpdate = {
		has_signed_in: true,
		...parsed
	};
	const response = await db
		.update('admins', toUpdate, {
			email: parsed.email,
			active: true,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	if (response.length !== 1) {
		throw error(500, 'DATA:CORE:ADMINS:SIGNIN:01', m.dizzy_awful_anteater_sew());
	}
	const parsedResponse = v.parse(schema.read, response[0]);
	const sessionCode = await createSession({
		instance_id: response[0].instance_id, // needs to be response[0] instead of parsedResponse because parsedResponse strips out the instance_id
		admin_id: parsedResponse.id
	});
	return { session: sessionCode.code, admin: parsedResponse };
}

export async function list({
	instance_id,
	url,
	includeDeleted = false
}: {
	instance_id: number;
	url: URL;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	const { where, options, filtered } = filterQuery(url, { search_key: 'full_name' });
	if (!filtered && !includeDeleted) {
		const cached = await redis.get(redisString(instance_id, 'all'));
		if (cached) return v.parse(schema.list, cached);
	}
	const sql = await db.select(
		'admins',
		{
			instance_id: instance_id,
			...where,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		},
		options
	);
	const response = await sql.run(pool);
	const count = await db
		.count('admins', {
			instance_id: instance_id,
			...where,
			...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
		})
		.run(pool);
	const parsedResponse = v.parse(schema.list, { count: count, items: response });
	if (!filtered) await redis.set(redisString(instance_id, 'all'), parsedResponse);
	return parsedResponse;
}

export async function readAdminApiKey({
	instance_id,
	t,
	admin_id
}: {
	instance_id: number;
	t: App.Localization;
	admin_id: number;
}): Promise<schema.ReadApiKey> {
	const response = await db
		.selectExactlyOne('admins', { instance_id, id: admin_id, deleted_at: db.conditions.isNull })
		.run(pool)
		.catch((err: Error) => {
			throw new BelcodaError(404, 'DATA:CORE:ADMINS:READAPIKEY:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResponse = v.parse(schema.readApiKey, response);
	return parsedResponse;
}

export async function updateApiKey({
	instance_id,
	t,
	admin_id
}: {
	instance_id: number;
	t: App.Localization;
	admin_id: number;
}): Promise<schema.ReadApiKey> {
	const response = await db
		.update(
			'admins',
			{ api_key: db.raw('uuid_generate_v4()') },
			{ instance_id, id: admin_id, deleted_at: db.conditions.isNull }
		)
		.run(pool)
		.catch((err: Error) => {
			throw new BelcodaError(
				500,
				'DATA:CORE:ADMINS:UPDATEAPIKEY:01',
				m.early_nimble_jackal_trim(),
				err
			);
		});
	if (response.length !== 1)
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:UPDATEAPIKEY:02', m.pretty_tired_fly_lead());
	const parsedResponse = v.parse(schema.readApiKey, response[0]);
	return parsedResponse;
}

export async function getApiKey({
	api_key,
	t
}: {
	api_key: string;
	t: App.Localization;
}): Promise<{ admin: schema.Read; instance: ReadInstance }> {
	const cached = await redis.get(`api_key:${api_key}`);
	if (cached) {
		const parsed = v.parse(schema.getAdminByApiKey, cached);
		const admin = await read({ instance_id: parsed.instance_id, admin_id: parsed.id, t });
		const instance = await readInstance({ instance_id: parsed.instance_id });
		return { admin, instance };
	} else {
		const response = await db
			.selectExactlyOne('admins', { api_key, active: true, deleted_at: db.conditions.isNull })
			.run(pool);
		const parsed = v.parse(schema.getAdminByApiKey, response);
		await redis.set(`api_key:${api_key}`, parsed);
		const admin = v.parse(schema.read, response);
		const instance = await readInstance({ instance_id: parsed.instance_id });
		return { admin, instance };
	}
}

export async function del({
	instance_id,
	admin_id,
	currentlySignedInAdminId,
	t,
	queue
}: {
	instance_id: number;
	admin_id: number;
	currentlySignedInAdminId: number;
	t: App.Localization;
	queue: App.Queue;
}): Promise<void> {
	// Return an error if the admin is trying to delete themselves.
	if (admin_id === currentlySignedInAdminId) {
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:DELETE:02', m.wide_male_parrot_enrich());
	}

	// Return error if admin is already deleted.
	// The read function will throw an error if the admin is not found or if the admin is deleted.
	await read({ instance_id, admin_id, t });

	// Throw error if the admin is the only admin.
	const count = await db
		.count('admins', { instance_id, deleted_at: db.conditions.isNull })
		.run(pool);
	if (count === 1) {
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:DELETE:03', m.low_petty_martin_dazzle());
	}

	// Return error if the admin is the default admin of the instance
	const instance = await readInstance({ instance_id });
	const defaultAdmin = instance.settings.default_admin_id;
	if (defaultAdmin === admin_id) {
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:DELETE:04', m.patient_muddy_llama_work());
	}

	// Expire all the admin's sessions
	await expireAllSessionsForAdmin({ instanceId: instance_id, adminId: admin_id });

	// Reassign all the admin's resources to the default admin
	// TODO: Allow the user to specify the new admin.
	// TODO: Maybe convert this from a queued job to a transaction in the future
	// (we don't want to silently fail to reassign resources, if they can't be reassigned for whatever reason, we should probably fail to delete the admin)
	await queue(
		'core/people/reassign_admin_resources',
		instance_id,
		{ admin_id },
		currentlySignedInAdminId
	);

	// Delete the admin.
	const response = await db
		.update('admins', { deleted_at: new Date() }, { instance_id, id: admin_id })
		.run(pool);
	if (response.length !== 1) {
		throw new BelcodaError(500, 'DATA:CORE:ADMINS:DELETE:01', m.ornate_real_swallow_honor());
	}

	// Clear admins list from cache.
	await redis.del(redisString(instance_id, admin_id));
	await redis.del(redisString(instance_id, 'all'));
}
