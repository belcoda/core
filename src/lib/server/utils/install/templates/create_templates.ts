/*
/ This file is responsible for creating the default templates for the instance.
/ It is currently DISABLED. It is not to be used. It is kept here as a reference, in case we need to re-enable it in the future to allow customized templates. 
*/

import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';

import createWhatsAppTemplates from '$lib/server/utils/install/templates/whatsapp/whatsapp_templates';

import EmailDefaultTemplate from '$lib/server/utils/install/templates/email/templates/default_template.hbs?raw';
import EmailDefaultTemplateText from '$lib/server/utils/install/templates/email/templates/default_template_text.hbs?raw';
import EmailEventTemplate from '$lib/server/utils/install/templates/email/templates/event_notification_template.hbs?raw';
import EmailEventTemplateText from '$lib/server/utils/install/templates/email/templates/event_notification_text.hbs?raw';

import { type Read as ReadInstance } from '$lib/schema/core/instance';

import { create as createWhatsAppTemplateApi } from '$lib/server/api/communications/whatsapp/templates';
import { create as createEamilTemplateApi } from '$lib/server/api/communications/email/templates';
import { create as createContentTypes } from '$lib/server/api/website/content_types';

export default async function ({ instance, t }: { instance: ReadInstance; t: App.Localization }) {
	const templates = {
		whatsApp: createWhatsAppTemplates({ instanceId: instance.id }),
		email: {
			default: EmailDefaultTemplate,
			defaultText: EmailDefaultTemplateText,
			event: EmailEventTemplate,
			eventText: EmailEventTemplateText
		}
	};

	const whatsAppInvitationTemplate = await createWhatsAppTemplateApi({
		instanceId: instance.id,
		body: templates.whatsApp.invitation
	});
	const whatsAppFreeResponseTemplate = await createWhatsAppTemplateApi({
		instanceId: instance.id,
		body: templates.whatsApp.freeResponse
	});
	//email templates
	const emailDefaultTemplate = await createEamilTemplateApi({
		instanceId: instance.id,
		t,
		body: {
			name: 'Event Default',
			subject: '[Enter subject]',
			from: instance.settings.communications.email.default_from_name,
			preview_text: '',
			text: templates.email.defaultText,
			html: templates.email.default,
			reply_to: `${instance.slug}@${PUBLIC_ROOT_DOMAIN}`,
			active: true
		}
	});
	const emailEventTemplate = await createEamilTemplateApi({
		t,
		instanceId: instance.id,
		body: {
			name: 'Event Notification',
			subject: 'Notification: Event',
			from: instance.settings.communications.email.default_from_name,
			preview_text: 'Notification for upcoming event',
			text: templates.email.eventText,
			html: templates.email.event,
			reply_to: `${instance.slug}@${PUBLIC_ROOT_DOMAIN}`,
			active: true
		}
	});

	//website templates
	// website templates have been removed. See: https://github.com/belcoda/core/tree/feature/improved_templates
	/* const websiteDefaultTemplate = await createWebsiteTemplateApi({
		instanceId: instance.id,
		body: {
			name: 'Default',
			html: templates.website.page,
			custom_code: {},
			html_metatags: {
				openGraph: {},
				twitter: {}
			}
		}
	});

	const websiteEventTemplate = await createWebsiteTemplateApi({
		instanceId: instance.id,
		body: {
			name: 'Event',
			html: templates.event,
			custom_code: {},
			html_metatags: {
				openGraph: {},
				twitter: {}
			}
		}
	});

	const websitePetitionTemplate = await createWebsiteTemplateApi({
		instanceId: instance.id,
		body: {
			name: 'Petition',
			html: templates.petition,
			custom_code: {},
			html_metatags: {
				openGraph: {},
				twitter: {}
			}
		}
	}); */

	//content types
	const pageContentType = await createContentTypes({
		instanceId: instance.id,
		body: {
			name: 'Page',
			slug: 'page'
		}
	});
	const postContentType = await createContentTypes({
		instanceId: instance.id,
		body: {
			name: 'Post',
			slug: 'post'
		}
	});

	return {
		website: {
			page: pageContentType,
			post: postContentType
		},
		email: {
			default: emailDefaultTemplate,
			event: emailEventTemplate
		},
		whatsapp: {
			invitation: whatsAppInvitationTemplate,
			freeResponse: whatsAppFreeResponseTemplate
		}
	};
}
