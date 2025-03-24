import {
	v,
	id,
	slug,
	integer,
	longString,
	timestamp,
	shortString,
	shortStringNotEmpty,
	mediumString,
	email,
	url,
	uuid
} from '$lib/schema/valibot';

export const base = v.object({
	id: id,
	instance_id: id,
	email: email,
	full_name: shortStringNotEmpty,
	profile_picture_url: v.nullable(url),

	google_access_token: v.nullable(longString),
	google_refresh_token: v.nullable(mediumString),
	google_id: v.nullable(mediumString),
	google_expires_in: v.nullable(mediumString),
	google_token_type: v.nullable(mediumString),

	permissions: v.tuple([v.literal('all')]),
	notification_schedule: v.picklist(['daily', 'weekly', 'all']),
	notification_channel: v.picklist(['email', 'sms', 'whatsapp']),
	active: v.boolean(),
	has_signed_in: v.boolean(),
	api_key: uuid,
	created_at: timestamp,
	updated_at: timestamp,
	deleted_at: v.nullable(timestamp)
});

export type Base = v.InferOutput<typeof base>;
export type AdminPermissions = v.InferOutput<typeof base.entries.permissions>;

export const signIn = v.object({
	...v.pick(base, [
		'email',
		'google_access_token',
		'google_refresh_token',
		'google_id',
		'google_expires_in',
		'google_token_type',
		'full_name'
	]).entries,
	profile_picture_url: v.optional(base.entries.profile_picture_url, null)
});

export type SignIn = v.InferOutput<typeof signIn>;

export const read = v.pick(base, [
	'id',
	'email',
	'full_name',
	'profile_picture_url',
	'permissions',
	'active',
	'has_signed_in',
	'created_at',
	'updated_at',
	'deleted_at'
]);

export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	count: integer,
	items: v.array(v.omit(read, ['deleted_at']))
});

export type List = v.InferOutput<typeof list>;

export const create = v.pick(base, ['email', 'full_name']);

export type Create = v.InferOutput<typeof create>;

export const readApiKey = v.pick(base, ['api_key']);

export type ReadApiKey = v.InferOutput<typeof readApiKey>;

export const getAdminByApiKey = v.pick(base, ['id', 'instance_id']);
export type GetAdminByApiKey = v.InferOutput<typeof getAdminByApiKey>;

export const update = v.partial(v.pick(base, ['full_name', 'profile_picture_url', 'active']));

export type Update = v.InferOutput<typeof update>;
