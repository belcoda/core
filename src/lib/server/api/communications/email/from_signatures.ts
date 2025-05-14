import {
	parse,
	v,
	email,
	id,
	mediumString,
	domainName,
	shortStringNotEmpty,
	mediumStringNotEmpty
} from '$lib/schema/valibot';
import * as schema from '$lib/schema/communications/email/from_signatures';

import { POSTMARK_ACCOUNT_TOKEN } from '$env/static/private';
import { type Settings } from '$lib/schema/core/instance';

import { BelcodaError, db, pool, redis, filterQuery, pino } from '$lib/server';
const log = pino(import.meta.url);

import { read as readInstance, update as updateInstance } from '$lib/server/api/core/instances';

export function redisString(instanceId: number, fromSignatureId: number | 'all') {
	return `i:${instanceId}:from_signatures:${fromSignatureId}`;
}

export const postmarkSendSignatureBody = v.object({
	ID: id,
	EmailAddress: email,
	Name: mediumString,
	Confirmed: v.boolean(),
	ReturnPathDomain: v.optional(v.nullable(domainName)),
	ReturnPathDomainVerified: v.optional(v.nullable(v.boolean()))
});

export const postmarkCreateSendSignatureBody = v.object({
	FromEmail: email,
	Name: shortStringNotEmpty,
	ReturnPathDomain: v.optional(v.nullable(domainName)),
	ConfirmationPersonalNote: v.optional(mediumStringNotEmpty)
});
type PostmarkCreateSendSignatureBody = v.InferInput<typeof postmarkCreateSendSignatureBody>;

export async function read({
	instanceId,
	fromSignatureId
}: {
	instanceId: number;
	fromSignatureId: number;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, fromSignatureId));
	if (cached) return parse(schema.read, cached);

	const result = await db
		.selectExactlyOne('communications.email_from_signatures', {
			instance_id: instanceId,
			id: fromSignatureId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:READ:01',
				'From signature not found',
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, fromSignatureId), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url,
	verifiedOnly = false
}: {
	instanceId: number;
	url: URL;
	verifiedOnly?: boolean;
}): Promise<schema.List> {
	const { options, where, filtered } = filterQuery(url);
	if (!filtered) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) return parse(schema.list, cached);
	}
	const verified = verifiedOnly ? { verified: true } : {};
	const result = await db
		.select('communications.email_from_signatures', {
			instance_id: instanceId,
			deleted_at: db.conditions.isNull,
			...verified,
			...where
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:LIST:01',
				'Error selecting from signatures',
				err
			);
		});
	const count = await db
		.count('communications.email_from_signatures', {
			instance_id: instanceId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count });
	await redis.set(redisString(instanceId, 'all'), parsedResult);
	return parsedResult;
}

export async function create({
	instanceId,
	body
}: {
	instanceId: number;
	body: schema.Create;
}): Promise<schema.Read> {
	const parsedBody = parse(schema.create, body);

	// If this is the first from signature, we need to set it to be the default in the event settings
	const { count } = await list({
		instanceId,
		url: new URL('http://example.com')
	}); //This is a dummy URL, we just need to get the count to see if it's zero prior to inserting...

	const createBody: PostmarkCreateSendSignatureBody = {
		FromEmail: parsedBody.email,
		Name: parsedBody.name,
		ReturnPathDomain: parsedBody.return_path_domain
	};

	const fetchResult = await fetch('https://api.postmarkapp.com/senders', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Postmark-Account-Token': POSTMARK_ACCOUNT_TOKEN
		},
		body: JSON.stringify(createBody)
	});
	if (!fetchResult.ok) {
		log.debug(createBody, 'Body we went postmark');
		log.debug(await fetchResult.json(), 'Response from postmark');
		throw new BelcodaError(
			422,
			'DATA:COMMUNICATIONS:FROM_SIGNATURES:CREATE:01',
			'Error creating from signature'
		);
	}
	const fetchResultBody = await fetchResult.json();
	const parsedFetchResult = parse(postmarkSendSignatureBody, fetchResultBody);

	const insertBody = {
		instance_id: instanceId,
		name: parsedBody.name,
		email: parsedBody.email,
		external_id: parsedFetchResult.ID.toString(),
		return_path_domain: parsedFetchResult.ReturnPathDomain,
		return_path_domain_verified: parsedFetchResult.ReturnPathDomainVerified === true ? true : false,
		verified: parsedFetchResult.Confirmed
	};

	const result = await db
		.insert('communications.email_from_signatures', {
			...insertBody,
			instance_id: instanceId
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				400,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:CREATE:01',
				'Error creating from signature',
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	await redis.del(redisString(instanceId, 'all'));

	// If this is the first from signature, we need to set it to be the default in the event settings
	if (count === 0) {
		const instance = await readInstance({ instance_id: instanceId });
		const newSettings: Settings = {
			...instance.settings,
			communications: {
				...instance.settings.communications,
				email: {
					...instance.settings.communications.email,
					default_from_signature_id: parsedResult.id
				}
			}
		};
		await updateInstance({
			instanceId,
			body: { settings: newSettings }
		});
	}

	return parsedResult;
}

export async function update({
	instanceId,
	fromSignatureId,
	body
}: {
	instanceId: number;
	fromSignatureId: number;
	body: schema.Update;
}): Promise<schema.Read> {
	const parsedBody = parse(schema.update, body);
	const result = await db

		.update(
			'communications.email_from_signatures',
			{
				name: parsedBody.name,
				return_path_domain: parsedBody.return_path_domain
			},
			{ id: fromSignatureId, instance_id: instanceId }
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				400,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:UPDATE:01',
				'Error updating from signature',
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, parsedResult.id), parsedResult);
	await redis.del(redisString(instanceId, 'all'));
	return parsedResult;
}

export async function testVerificationStatus({
	instanceId,
	fromSignatureId
}: {
	instanceId: number;
	fromSignatureId: number;
}): Promise<schema.Read> {
	const signature = await read({
		instanceId,
		fromSignatureId
	});

	if (!signature.verified) {
		//let's check with the API to see if it's verified??

		const result = await fetch(`https://api.postmarkapp.com/senders/${signature.external_id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Postmark-Account-Token': POSTMARK_ACCOUNT_TOKEN
			}
		}).then((res) => res.json());
		const parsedResult = parse(postmarkSendSignatureBody, result);
		if (parsedResult.Confirmed) {
			const domainVerified = parsedResult.ReturnPathDomainVerified === true ? true : false;
			await db
				.update(
					'communications.email_from_signatures',
					{
						verified: true,
						external_id: parsedResult.ID.toString(),
						return_path_domain: parsedResult.ReturnPathDomain,
						return_path_domain_verified: domainVerified
					},
					{ instance_id: instanceId, id: fromSignatureId }
				)
				.run(pool);
		}
		await redis.del(redisString(instanceId, fromSignatureId));
		await redis.del(redisString(instanceId, 'all'));
	}
	return await read({ instanceId, fromSignatureId });
}

export async function _unsafeGetAllPendingVerification(): Promise<schema.Base[]> {
	const result = await db
		.select('communications.email_from_signatures', {
			verified: false,
			deleted_at: db.conditions.isNull,
			created_at: db.conditions.gt(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)) // If it hasn't been verified in 30 days, it's probably not going to be verified. Let's stop checking.
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:LIST:01',
				'Error selecting from signatures',
				err
			);
		});
	return parse(v.array(schema.base), result); //Needs to be base because we want the instance_id
}

export async function _unsafeGetAllPendingDomainVerification(): Promise<schema.Base[]> {
	const result = await db
		.select('communications.email_from_signatures', {
			return_path_domain_verified: false,
			return_path_domain: db.conditions.isNotNull,
			deleted_at: db.conditions.isNull,
			created_at: db.conditions.gt(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)) // If it hasn't been verified in 30 days, it's probably not going to be verified. Let's stop checking.
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:LIST:01',
				'Error selecting from signatures',
				err
			);
		});

	return parse(v.array(schema.base), result); //Needs to be base because we want the instance_id
}

export async function del({
	instanceId,
	fromSignatureId
}: {
	instanceId: number;
	fromSignatureId: number;
}): Promise<void> {
	const signature = await read({
		instanceId,
		fromSignatureId
	});

	const fetchResult = await fetch(`https://api.postmarkapp.com/senders/${signature.external_id}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Postmark-Account-Token': POSTMARK_ACCOUNT_TOKEN
		}
	});

	if (!fetchResult.ok) {
		const errorBody = await fetchResult.json();
		if (errorBody?.Message !== 'This signature was not found.') {
			// If it's not found, we don't care, let's just delete it from the DB
			log.debug(await fetchResult.json(), 'Delete send signature failed. Response from postmark');
			throw new BelcodaError(
				422,
				'DATA:COMMUNICATIONS:FROM_SIGNATURES:DELETE:01',
				'Error deleting from signature'
			);
		}
	}

	await db
		.update(
			'communications.email_from_signatures',
			{
				deleted_at: new Date()
			},
			{ instance_id: instanceId, id: fromSignatureId }
		)
		.run(pool);
	await redis.del(redisString(instanceId, fromSignatureId));
	await redis.del(redisString(instanceId, 'all'));
	return;
}
