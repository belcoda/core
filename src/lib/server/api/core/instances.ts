import * as schema from '$lib/schema/core/instance';
import { v } from '$lib/schema/valibot';
import { db, redis, pool, BelcodaError } from '$lib/server';

export const read = async ({ instance_id }: { instance_id: number }): Promise<schema.Read> => {
	const cached = await redis.get(`i:${instance_id}`);
	if (cached) return v.parse(schema.read, cached);
	const response = await db.selectExactlyOne('instances', { id: instance_id }).run(pool);
	const parsedResponse = v.parse(schema.read, response);
	await redis.set(`i:${instance_id}`, parsedResponse);
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
		throw new BelcodaError(404, 'DATA:INSTANCES:UPDATE:01', t.errors.not_found());
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
}): Promise<Record<string, string>> {
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
