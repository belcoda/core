import {
	v,
	id,
	slug,
	url,
	language,
	country,
	timestamp,
	shortString,
	email,
	longStringNotEmpty,
	domainName,
	phoneNumber
} from '$lib/schema/valibot';

import { PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER } from '$env/static/public';
import { emailTemplates } from '$lib/schema/communications/email/messages';

export const settings = v.object({
	default_admin_id: id,
	home_page_url: v.nullable(url),
	events: v.object({
		event_email_template_prefix: v.optional(shortString, ''), //prefix for the template name for event notifications incase we need to give some instances access to different templates
		default_event_info_settings: v.object({
			ask_email: v.optional(v.boolean(), true),
			ask_phone_number: v.optional(v.boolean(), true),
			ask_postcode: v.optional(v.boolean(), true),
			ask_address: v.optional(v.boolean(), false),
			require_email: v.optional(v.boolean(), false),
			require_phone_number: v.optional(v.boolean(), false),
			require_postcode: v.optional(v.boolean(), false),
			require_address: v.optional(v.boolean(), false)
		})
	}),
	communications: v.object({
		email: v.object({
			default_from_name: shortString,
			default_from_signature_id: v.optional(id),
			default_template_name: v.optional(v.picklist(emailTemplates), 'main')
		}),
		whatsapp: v.object({
			default_template_id: id,
			phone_number: v.optional(phoneNumber, PUBLIC_DEFAULT_WHATSAPP_PHONE_NUMBER),
			business_account_id: v.nullable(shortString)
		})
	}),
	petitions: v.object({}),
	website: v.object({
		custom_domain: v.nullable(domainName), //if custom domain is null, the the website will be https://${instance.slug}.{PUBLIC_ROOT_DOMAIN}. Otherwise, it will be https://${customDomain}
		pages_content_type_id: id,
		posts_content_type_id: id,
		logo_url: url,
		favicon: v.nullable(url),
		header_links: v.array(
			v.object({
				text: shortString,
				url: url,
				new_tab: v.boolean()
			})
		),
		footer_links: v.array(
			v.object({
				text: shortString,
				url: url,
				new_tab: v.boolean()
			})
		)
	})
});
export type Settings = v.InferOutput<typeof settings>;
export type SettingsInput = v.InferInput<typeof settings>;
//do not add to any read etc, because it is not meant to be exposed normally.
export const secrets = v.objectWithRest(
	{
		WHATSAPP_ACCESS_KEY: longStringNotEmpty
	},
	v.string()
);
//objectWithRest allows any other key, but requires the keys specified in the schema
//this will allow users to set arbitrary secrets if we implement that functionality down the track, but will require the ones specified in the schema
export type Secrets = v.InferOutput<typeof secrets>;

export const base = v.object({
	id: id,
	name: shortString,
	slug: slug,
	owner_email: email,
	language: language,
	installed: v.boolean(),
	country: country,
	created_at: timestamp,
	updated_at: timestamp,
	settings: settings,
	secrets: secrets
});

export const read = v.omit(base, ['secrets']);

export type Read = v.InferOutput<typeof read>;

export const list = v.array(read);

export type List = v.InferOutput<typeof list>;

export const create = v.omit(read, ['id', 'created_at', 'updated_at']);
export type Create = v.InferOutput<typeof create>;

export const update = v.partial(
	v.omit(base, ['id', 'name', 'slug', 'country', 'installed', 'created_at', 'updated_at'])
);
export type Update = v.InferInput<typeof update>;

export const updateSecrets = v.object({
	secrets: secrets
});
export type UpdateSecrets = v.InferInput<typeof updateSecrets>;
