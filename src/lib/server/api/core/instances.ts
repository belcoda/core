import * as schema from '$lib/schema/core/instance';
import { v } from '$lib/schema/valibot';
import { db, redis, pool, BelcodaError } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export const read = async ({ instance_id }: { instance_id: number }): Promise<schema.Read> => {
	const cached = await redis.get(`i:${instance_id}`);
	if (cached) return v.parse(schema.read, cached);
	const response = await db.selectExactlyOne('instances', { id: instance_id }).run(pool);
	const parsedResponse = v.parse(schema.read, response);
	await redis.set(`i:${instance_id}`, parsedResponse);
	return parsedResponse;
};

export const create = async ({
	body,
	t
}: {
	body: schema.Create;
	t: App.Localization;
}): Promise<schema.Read> => {
	const parsed = v.parse(schema.create, body);
	const response = await db.insert('instances', parsed).run(pool);
	const parsedResponse = v.parse(schema.read, response);
	await redis.set(`i:${parsedResponse.id}`, parsedResponse);
	await redis.del('i:count');
	return parsedResponse;
};

export const update = async ({
	instanceId,
	body,
	t
}: {
	instanceId: number;
	body: schema.Update;
	t: App.Localization;
}): Promise<schema.Read> => {
	const parsed = v.parse(schema.update, body);
	const response = await db.update('instances', parsed, { id: instanceId }).run(pool);
	if (response.length !== 1)
		throw new BelcodaError(404, 'DATA:INSTANCES:UPDATE:01', m.pretty_tired_fly_lead());
	const parsedUpdate = v.parse(schema.read, response[0]);
	await redis.set(`i:${instanceId}`, parsedUpdate);
	return parsedUpdate;
};

export const readBySubdomain = async ({
	subdomain
}: {
	subdomain: string;
}): Promise<schema.Read> => {
	const cached = await redis.get(`i:${subdomain}`);
	if (cached) return v.parse(schema.read, cached);
	const response = await db.selectExactlyOne('instances', { slug: subdomain }).run(pool);
	const parsedResponse = v.parse(schema.read, response);
	await redis.set(`i:${subdomain}`, parsedResponse);
	return parsedResponse;
};
export async function _readSecretsUnsafe({
	instanceId
}: {
	instanceId: number;
}): Promise<schema.Secrets> {
	const response = await db
		.selectExactlyOne('instances', { id: instanceId }, { columns: ['secrets'] })
		.run(pool);
	const parsed = v.parse(schema.secrets, response.secrets);
	return parsed;
}

export async function _getInstanceByWhatsappPhoneNumberId({
	whatsappPhoneNumberId
}: {
	whatsappPhoneNumberId: string;
}): Promise<schema.Read> {
	const response =
		await db.sql`SELECT id FROM instances WHERE settings->'communications'->'whatsapp'->>'phone_number_id' = ${db.param(whatsappPhoneNumberId)} limit 1`.run(
			pool
		);
	if (response.length !== 1)
		throw new BelcodaError(
			400,
			'DATA:INSTANCES:GET_BY_WHATSAPP_PHONE_NUMBER_ID:01',
			'No instance found with that phone number id'
		);
	return await read({ instance_id: response[0].id });
}

export async function _getInstanceByWhatsappBAId({
	whatsappBAId
}: {
	whatsappBAId: string;
}): Promise<schema.Read> {
	const response =
		await db.sql`SELECT id FROM instances WHERE settings->'communications'->'whatsapp'->>'business_account_id' = ${db.param(whatsappBAId)} limit 1`.run(
			pool
		);
	if (response.length !== 1)
		throw new BelcodaError(
			400,
			'DATA:INSTANCES:GET_BY_WHATSAPP_BUSINESS_ID:01',
			'No instance found with that business ID'
		);
	return await read({ instance_id: response[0].id });
}

export async function _getInstanceIdByEventId(eventId: string): Promise<schema.Read> {
	const response =
		await db.sql`SELECT instance_id from events.events WHERE id = ${db.param(eventId)} AND deleted_at IS NULL limit 1`.run(
			pool
		);
	if (response.length !== 1)
		throw new BelcodaError(
			400,
			'DATA:INSTANCES:GET_BY_EVENT_ID:01',
			'No instance found with that event ID'
		);
	return await read({ instance_id: response[0].instance_id });
}

export async function _getInstanceIdByPetitionId(petitionId: string): Promise<schema.Read> {
	const response =
		await db.sql`SELECT instance_id from petitions.petitions WHERE id = ${db.param(petitionId)} limit 1`.run(
			pool
		);
	if (response.length !== 1)
		throw new BelcodaError(
			400,
			'DATA:INSTANCES:GET_BY_PETITION_ID:01',
			'No instance found with that petition ID'
		);
	return await read({ instance_id: response[0].instance_id });
}

const instanceCountSchema = v.pipe(v.number(), v.integer(), v.minValue(0));

export async function _count(): Promise<number> {
	const count = await redis.get(`i:count`);
	if (count) return v.parse(instanceCountSchema, count);
	const response = await db.count('instances', {}).run(pool);
	const parsed = v.parse(instanceCountSchema, response);
	await redis.set(`i:count`, parsed);
	return parsed;
}

export async function _updateSetInstalled({ instanceId }: { instanceId: number }): Promise<void> {
	await db.update('instances', { installed: true }, { id: instanceId }).run(pool);
	await redis.del(`i:${instanceId}`);
}
