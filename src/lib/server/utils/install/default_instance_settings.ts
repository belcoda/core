import type { InstallOptions } from '$lib/server/utils/install/index';
import { type SettingsInput } from '$lib/schema/core/instance';
import { PUBLIC_HOST, PUBLIC_ROOT_DOMAIN } from '$env/static/public';
import * as m from '$lib/paraglide/messages';
// ➡️ Removed user-generated templates from the app. See: https://github.com/belcoda/core/tree/feature/improved_templates

import createTemplates from '$lib/server/utils/install/templates/create_templates';
type TemplateOutputs = Awaited<ReturnType<typeof createTemplates>>;

export default function (
	options: InstallOptions,
	t: App.Localization,
	templates?: TemplateOutputs,
	adminId?: number
): SettingsInput {
	const homePageUrl =
		options.homePageUrl || `https://${options.instanceSlug}.${PUBLIC_ROOT_DOMAIN}`;

	//default settings for IDs are 999999 in order to satisfy validation requirements. I chose 999999 so that it's super obvious that these settings shouldn't be like this after initialization
	const instanceSettings: SettingsInput = {
		default_admin_id: adminId || 999999,
		home_page_url: homePageUrl,
		events: {
			event_email_template_prefix: '',
			default_event_info_settings: {}
		},
		communications: {
			email: {
				default_template_name: 'main',
				default_from_name: `${options.instanceName} <${options.instanceSlug}@${PUBLIC_ROOT_DOMAIN}>`
			},
			whatsapp: {
				default_template_id: templates?.whatsapp.invitation.id || 999999,
				phone_number_id: null,
				business_account_id: null
			}
		},
		petitions: {},
		website: {
			custom_domain: null, //if custom domain is null, the the website will be https://${instance.slug}.{PUBLIC_ROOT_DOMAIN}. Otherwise, it will be https://${customDomain}
			pages_content_type_id: templates?.website.page.id || 999999,
			posts_content_type_id: templates?.website.post.id || 999999,
			logo_url: options.logoUrl,
			favicon: options.faviconUrl || `${PUBLIC_HOST}/logos/favicon.svg`,
			header_links: [
				{
					text: m.agent_lime_puma_trip(),
					url: homePageUrl,
					new_tab: false
				},
				{
					text: m.wise_cozy_warbler_grow(),
					url: `${homePageUrl}/events`,
					new_tab: false
				}
			],
			footer_links: [
				{
					text: m.agent_lime_puma_trip(),
					url: homePageUrl,
					new_tab: false
				},
				{
					text: m.agent_lime_puma_trip(),
					url: `${homePageUrl}/events`,
					new_tab: false
				}
			]
		}
	};
	return instanceSettings;
}
