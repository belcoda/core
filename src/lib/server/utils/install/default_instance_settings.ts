import type { InstallOptions } from '$lib/server/utils/install/index';
import { type SettingsInput } from '$lib/schema/core/instance';
import createTemplates from '$lib/server/utils/install/templates/create_templates';
import { PUBLIC_HOST, PUBLIC_ROOT_DOMAIN } from '$env/static/public';
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
			default_template_id: templates?.website.templates.event.id || 999999,
			default_email_template_id: templates?.email.event.id || 999999,
			default_event_info_settings: {}
		},
		communications: {
			email: {
				default_from_name: `${options.instanceName} <${options.instanceSlug}@${PUBLIC_ROOT_DOMAIN}>`,
				default_template_id: templates?.email.default.id || 999999
			},
			whatsapp: {
				default_template_id: templates?.whatsapp.invitation.id || 999999,
				phone_number_id: null,
				business_account_id: null
			}
		},
		petitions: {
			default_template_id: templates?.website.templates.petition.id || 999999
		},
		website: {
			default_template_id: templates?.website.templates.default.id || 999999,
			custom_domain: null, //if custom domain is null, the the website will be https://${instance.slug}.{PUBLIC_ROOT_DOMAIN}. Otherwise, it will be https://${customDomain}
			pages_content_type_id: templates?.website.page.id || 999999,
			posts_content_type_id: templates?.website.post.id || 999999,
			logo_url: options.logoUrl,
			favicon: options.faviconUrl || `${PUBLIC_HOST}/logos/favicon.svg`,
			header_links: [
				{
					text: t.communications.website.menus.default.items.home.title(),
					url: homePageUrl,
					new_tab: false
				},
				{
					text: t.communications.website.menus.default.items.events.title(),
					url: `${homePageUrl}/events`,
					new_tab: false
				}
			],
			footer_links: [
				{
					text: t.communications.website.menus.default.items.home.title(),
					url: homePageUrl,
					new_tab: false
				},
				{
					text: t.communications.website.menus.default.items.events.title(),
					url: `${homePageUrl}/events`,
					new_tab: false
				}
			]
		}
	};
	return instanceSettings;
}
