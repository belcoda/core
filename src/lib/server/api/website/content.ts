import { db, pool, redis, BelcodaError, filterQuery } from '$lib/server';
import { parse, id } from '$lib/schema/valibot';
import * as schema from '$lib/schema/website/content';
import * as m from '$lib/paraglide/messages';
import { type ContentHTMLMetaTags } from '$lib/schema/utils/openai';

import { read as readContentType, exists } from '$lib/server/api/website/content_types';
import { slugify } from '$lib/utils/text/string';

function redisString(instanceId: number, contentTypeId: number, contentId: number | 'all') {
	return `i:${instanceId}:content_types:${contentTypeId}:content:${contentId}`;
}

function redisStringSlug(instanceId: number, contentTypeId: number, slug: string) {
	return `i:${instanceId}:content_slug:${contentTypeId}:${slug}`;
}

export async function create({
	instanceId,
	contentTypeId,
	body,
	queue
}: {
	instanceId: number;
	contentTypeId: number;
	body: schema.Create;
	queue: App.Queue;
}): Promise<schema.Read> {
	const parsed = parse(schema.create, body);
	const contentType = await readContentType({ instanceId, contentTypeId });
	// function to insert a guaranteed unique name and slug based on the heading
	// after checking to ensure the name and slug are unique, it inserts the item

	const result = await db.transaction(pool, db.IsolationLevel.Serializable, async (txnClient) => {
		const baseName = parsed.name || parsed.heading;
		const baseSlug = parsed.slug || slugify(parsed.heading);
		let uniqueName = baseName;
		let uniqueSlug = baseSlug;
		let counter = 1;
		while (true) {
			const exists =
				await db.sql`SELECT id FROM website.content WHERE deleted_at = ${db.conditions.isNull} AND content_type_id = ${db.param(contentTypeId)} AND (name = ${db.param(uniqueName)} OR slug = ${db.param(uniqueSlug)})`.run(
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
			.insert('website.content', {
				content_type_id: contentTypeId,
				...parsed,
				name: parsed.name || uniqueName,
				slug: parsed.slug || uniqueSlug
			})
			.run(txnClient);
	});
	await redis.del(redisString(instanceId, contentTypeId, 'all'));
	const returned = await read({ instanceId, contentTypeId, contentId: result.id }); //this already sets the cache
	const htmlMeta: ContentHTMLMetaTags = {
		type: 'content',
		contentId: returned.id,
		contentTypeId: contentTypeId
	};
	await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	return returned;
}

export async function read({
	instanceId,
	contentTypeId,
	contentId,
	includeDeleted = false
}: {
	instanceId: number;
	contentTypeId: number;
	contentId: number;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisString(instanceId, contentTypeId, contentId));
	if (cached && !includeDeleted) {
		return parse(schema.read, cached);
	}
	await exists({ instanceId, contentTypeId });
	const result = await db
		.selectExactlyOne(
			'website.content',
			{
				id: contentId,
				content_type_id: contentTypeId,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
				lateral: {
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:WEBSITE:CONTENT:READ:01', m.pretty_tired_fly_lead(), err);
		});
	const parsedResult = parse(schema.read, result);
	await redis.set(redisString(instanceId, contentTypeId, contentId), parsedResult);
	return parsedResult;
}

export async function readBySlug({
	instanceId,
	slug,
	contentTypeId,
	includeDeleted = false
}: {
	instanceId: number;
	slug: string;
	contentTypeId: number;
	includeDeleted?: boolean;
}): Promise<schema.Read> {
	const cached = await redis.get(redisStringSlug(instanceId, contentTypeId, slug));
	if (cached && !includeDeleted) {
		const contentId = parse(id, cached);
		return read({ instanceId, contentTypeId, contentId });
	}
	const result = await db
		.selectExactlyOne(
			'website.content',
			{
				slug,
				content_type_id: contentTypeId,
				...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
			},
			{
				columns: ['id'],
				lateral: {
					feature_image: db.selectOne('website.uploads', {
						id: db.parent('feature_image_upload_id')
					})
				}
			}
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(
				404,
				'DATA:WEBSITE:CONTENT:READBYSLUG:01',
				m.pretty_tired_fly_lead(),
				err
			);
		});
	const contentId = parse(id, result.id);
	await redis.set(redisStringSlug(instanceId, contentTypeId, slug), contentId);
	return await read({ instanceId, contentTypeId, contentId });
}

export async function list({
	instanceId,
	contentTypeId,
	url,
	includeDeleted = false
}: {
	instanceId: number;
	contentTypeId: number;
	url: URL;
	includeDeleted?: boolean;
}): Promise<schema.List> {
	const filter = filterQuery(url);
	if (!includeDeleted && filter.filtered !== true) {
		const cached = await redis.get(redisString(instanceId, contentTypeId, 'all'));
		if (cached) {
			return parse(schema.list, cached);
		}
	}
	await exists({ instanceId, contentTypeId });
	const where = {
		...filter.where,
		...(includeDeleted ? {} : { deleted_at: db.conditions.isNull })
	};
	const result = await db
		.select('website.content', { content_type_id: contentTypeId, ...where }, filter.options)
		.run(pool);

	const count = await db
		.count('website.content', { content_type_id: contentTypeId, ...where })
		.run(pool);
	const parsedResult = parse(schema.list, { count: count, items: result });
	await redis.set(redisString(instanceId, contentTypeId, 'all'), parsedResult);
	return parsedResult;
}

export async function update({
	instanceId,
	contentTypeId,
	contentId,
	body,
	queue,
	skipMetaGeneration = false
}: {
	instanceId: number;
	contentTypeId: number;
	contentId: number;
	body: schema.Update;
	queue: App.Queue;
	skipMetaGeneration?: boolean;
}): Promise<schema.Read> {
	const parsed = parse(schema.update, body);
	const result = await db
		.update('website.content', parsed, {
			id: contentId,
			content_type_id: contentTypeId,
			deleted_at: db.conditions.isNull
		})
		.run(pool);
	if (result.length !== 1) {
		throw new BelcodaError(404, 'DATA:WEBSITE:CONTENT:UPDATE:01', m.pretty_tired_fly_lead());
	}
	await redis.del(redisString(instanceId, contentTypeId, contentId));
	await redis.del(redisString(instanceId, contentTypeId, 'all'));
	const returned = await read({ instanceId, contentTypeId, contentId }); //update the cache with the new updated object
	const htmlMeta: ContentHTMLMetaTags = {
		type: 'content',
		contentId: returned.id,
		contentTypeId: contentTypeId
	};
	if (skipMetaGeneration !== true) {
		await queue('/utils/openai/generate_html_meta', instanceId, htmlMeta);
	}
	return returned;
}

export async function del({
	instanceId,
	contentTypeId,
	contentId
}: {
	instanceId: number;
	contentTypeId: number;
	contentId: number;
}): Promise<void> {
	await db
		.update(
			'website.content',
			{ deleted_at: new Date() },
			{ id: contentId, content_type_id: contentTypeId }
		)
		.run(pool)
		.catch((err) => {
			throw new BelcodaError(404, 'DATA:WEBSITE:CONTENT:DEL:01', m.pretty_tired_fly_lead(), err);
		});
	await redis.del(redisString(instanceId, contentTypeId, contentId));
	await redis.del(redisString(instanceId, contentTypeId, 'all'));
}
