import { db, pool, redis, type s, BelcodaError, filterQuery, pino } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { parse } from '$lib/schema/valibot';
import * as schema from '$lib/schema/petitions/petitions';
import type { Read as ReadInstance } from '$lib/schema/core/instance';

import { randomUUID } from 'crypto';

import htmlEmail from '$lib/utils/templates/email/petitions/petition_autoresponse_html.handlebars?raw';
import textEmail from '$lib/utils/templates/email/petitions/petition_autoresponse_text.handlebars?raw';
import { type PetitionHTMLMetaTags } from '$lib/schema/utils/openai';

import { read as readInstance } from '$lib/server/api/core/instances';
import { create as createEmailMessage } from '$lib/server/api/communications/email/messages';
import { slugify } from '$lib/utils/text/string';

export function redisString(instanceId: number, petitionId: number | 'all') {
	return `i:${instanceId}:petitions:${petitionId}`;
}
export function redisStringSlug(instanceId: number, slug: string) {
	return `i:${instanceId}:petitionslug:${slug}`;
}

export async function exists({
	instanceId,
	petitionId
}: {
	instanceId: number;
	petitionId: number;
}): Promise<boolean> {
	const cached = await redis.get(redisString(instanceId, petitionId));
	if (cached) {
		return true;
	}
	await db
		.selectExactlyOne('petitions.petitions', {
			instance_id: instanceId,
			id: petitionId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PETITIONS:PETITIONS:EXISTS:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	return true;
}

export async function create({
	instanceId,
	adminId,
	body,
	queue
}: {
	instanceId: number;
	adminId: number;
	body: schema.Create;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const instance = await readInstance({ instance_id: instanceId });
	const emailMessage = await createPetitionEmail({
		body: parsed,
		queue,
		instanceId,
		adminId,
		instance,
		defaultEmailTemplateId: instance.settings.communications.email.default_template_id
	});

	// function to insert a guaranteed unique name and slug based on the heading
	// after checking to ensure the name and slug are unique, it inserts the item
	const inserted = await db.transaction(pool, db.IsolationLevel.Serializable, async (txnClient) => {
		const baseName = parsed.name || parsed.heading;
		const baseSlug = parsed.slug || slugify(parsed.heading);
		let uniqueName = baseName;
		let uniqueSlug = baseSlug;
		let counter = 1;
		while (true) {
			const exists =
				await db.sql`SELECT id FROM petitions.petitions WHERE deleted_at IS NULL AND instance_id = ${db.param(instanceId)} AND (name = ${db.param(uniqueName)} OR slug = ${db.param(uniqueSlug)})`.run(
					txnClient
				);

			if (exists.length === 0) {
				// Both are unique
				break;
			}

			// Increment counter and modify name and slug
			uniqueName = `${baseName} (${counter})`;
			uniqueSlug = `${baseSlug}_${counter}`;
			counter += 1;
		}
		return await db
			.insert('petitions.petitions', {
				instance_id: instanceId,
				point_person_id: adminId,
				autoresponse_email: emailMessage,
				...parsed,
				name: parsed.name || uniqueName,
				slug: parsed.slug || uniqueSlug
			})
			.run(txnClient);
	});

	await redis.del(redisString(instanceId, adminId));
	await redis.del(redisString(instanceId, 'all'));
	const returned = await read({ instanceId, petitionId: inserted.id });
	const htmlMeta: PetitionHTMLMetaTags = { type: 'petition', petitionId: returned.id };
	await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	return returned;
}

export async function update({
	instanceId,
	petitionId,
	body,
	queue,
	skipMetaGeneration = false
}: {
	instanceId: number;
	petitionId: number;
	body: schema.Update;
	queue: App.Queue;
	skipMetaGeneration?: boolean;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const updated = await db
		.update('petitions.petitions', parsed, {
			instance_id: instanceId,
			id: petitionId,
			deleted_at: db.conditions.isNull
		})
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PETITIONS:PETITIONS:UPDATE:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	if (updated.length !== 1)
		throw new BelcodaError(404, 'DATA:PETITIONS:PETITIONS:UPDATE:02', m.pretty_tired_fly_lead());
	await redis.del(redisString(instanceId, 'all'));
	await redis.del(redisString(instanceId, petitionId));
	const returned = await read({ instanceId, petitionId: petitionId });
	await redis.del(redisStringSlug(instanceId, returned.slug));
	const htmlMeta: PetitionHTMLMetaTags = { type: 'petition', petitionId: petitionId };
	if (skipMetaGeneration !== true) {
		await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	}
	return returned;
}

export async function read({
	instanceId,
	petitionId,
	includeDeleted = false
}: {
	instanceId: number;
	petitionId: number;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, petitionId));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne(
			'petitions.petitions',
			{
				instance_id: instanceId,
				id: petitionId,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
				lateral: {
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					autoresponse_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('autoresponse_email')
					}),
					signatures: db.count('petitions.signatures', {
						petition_id: db.parent('id')
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:EVENTS:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, petitionId), parsedResult);
	return parsedResult;
}

export async function readBySlug({
	instanceId,
	slug
}: {
	instanceId: number;
	slug: string;
}): Promise<schema.Read> {
	const cached = await redis.get(redisStringSlug(instanceId, slug));
	if (cached) {
		return parse(schema.read, cached);
	}
	const result = await db
		.selectExactlyOne(
			'petitions.petitions',
			{ instance_id: instanceId, slug, deleted_at: db.conditions.isNull },
			{
				lateral: {
					signatures: db.count('petitions.signatures', { petition_id: db.parent('id') }),
					autoresponse_email: db.selectExactlyOne('communications.email_messages', {
						id: db.parent('autoresponse_email')
					}),
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					}),
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') })
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:PETITIONS:PETITIONS:READBYSLUG:01',
				'Petition not found',
				err
			);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisStringSlug(instanceId, slug), parsedResult);
	return parsedResult;
}

export async function list({
	instanceId,
	url,
	includeDeleted = false
}: {
	instanceId: number;
	url: URL;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	const where = {
		...filter.where,
		...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
	};
	const result = await db
		.select(
			'petitions.petitions',
			{ instance_id: instanceId, ...where },
			{
				lateral: {
					point_person: db.selectExactlyOne('admins', { id: db.parent('point_person_id') }),
					signatures: db.count('petitions.signatures', {
						petition_id: db.parent('id')
					})
				},
				...filter.options
			}
		)
		.run(pool);
	const count = await db
		.count('petitions.petitions', { instance_id: instanceId, ...where })
		.run(pool);
	const parsedResult = parse(schema.list, { items: result, count: count });

	if (filter.filtered !== true) {
		await redis.set(redisString(instanceId, 'all'), parsedResult);
	}
	return parsedResult;
}

/// Helper functions

async function createPetitionEmail({
	body,
	instanceId,
	adminId,
	instance,
	defaultEmailTemplateId,
	queue
}: {
	body: schema.Create;
	instanceId: number;
	adminId: number;
	instance: ReadInstance;
	defaultEmailTemplateId: number;
	queue: App.Queue;
}): Promise<number> {
	const registrationEmail = await createEmailMessage({
		instanceId,
		queue,
		body: {
			name: randomUUID(),
			point_person_id: adminId,
			from: `${instance.name} <${instance.slug}@belcoda.com>`,
			reply_to: `${instance.slug}@belcoda.com`,
			subject: `${body.heading}`,
			html: htmlEmail,
			text: textEmail,
			preview_text: `Thank you for signing {{petition.heading}}`,
			use_html_for_plaintext: true,
			template_id: defaultEmailTemplateId
		},
		defaultTemplateId: defaultEmailTemplateId
	});
	return registrationEmail.id;
}

export async function del({
	instanceId,
	petitionId
}: {
	instanceId: number;
	petitionId: number;
}): Promise<void> {
	await db
		.update(
			'petitions.petitions',
			{ deleted_at: new Date() },
			{ instance_id: instanceId, id: petitionId }
		)
		.run(pool);
	await redis.del(redisString(instanceId, petitionId));
	await redis.del(redisString(instanceId, 'all'));
}
