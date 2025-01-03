import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';

import createWhatsAppTemplates from '$lib/server/utils/install/templates/whatsapp/whatsapp_templates';
import PetitionTemplate from '$lib/server/utils/install/templates/petitions/petition_template.hbs?raw';
import EventTemplate from '$lib/server/utils/install/templates/events/event_template.hbs?raw';

import EmailDefaultTemplate from '$lib/server/utils/install/templates/email/templates/default_template.hbs?raw';
import EmailDefaultTemplateText from '$lib/server/utils/install/templates/email/templates/default_template_text.hbs?raw';
import EmailEventTemplate from '$lib/server/utils/install/templates/email/templates/event_notification_template.hbs?raw';
import EmailEventTemplateText from '$lib/server/utils/install/templates/email/templates/event_notification_text.hbs?raw';

import PageTemplate from '$lib/server/utils/install/templates/website/page.hbs?raw';

import HeaderBlock from '$lib/server/utils/install/templates/website/blocks/header.hbs?raw';
import FooterBlock from '$lib/server/utils/install/templates/website/blocks/footer.hbs?raw';
import CTABlock from '$lib/server/utils/install/templates/website/blocks/cta.hbs?raw';

import { type Read as ReadInstance } from '$lib/schema/core/instance';

import { create as createWhatsAppTemplateApi } from '$lib/server/api/communications/whatsapp/templates';
import { create as createEamilTemplateApi } from '$lib/server/api/communications/email/templates';
import { create as createWebsiteTemplateApi } from '$lib/server/api/website/templates';
import { create as createContentTypes } from '$lib/server/api/website/content_types';
import { create as createWebsiteBlocksApi } from '$lib/server/api/website/blocks';

export default async function ({ instance, t }: { instance: ReadInstance; t: App.Localization }) {
	const templates = {
		whatsApp: createWhatsAppTemplates({ instanceId: instance.id }),
		email: {
			default: EmailDefaultTemplate,
			defaultText: EmailDefaultTemplateText,
			event: EmailEventTemplate,
			eventText: EmailEventTemplateText
		},
		event: EventTemplate,
		petition: PetitionTemplate,
		website: {
			page: PageTemplate,
			blocks: {
				header: HeaderBlock,
				footer: FooterBlock,
				cta: CTABlock
			}
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
	const websiteDefaultTemplate = await createWebsiteTemplateApi({
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
	});

	//content types
	const pageContentType = await createContentTypes({
		instanceId: instance.id,
		body: {
			name: 'Page',
			slug: 'page',
			collection_template_id: websiteDefaultTemplate.id,
			content_template_id: websiteDefaultTemplate.id
		}
	});
	const postContentType = await createContentTypes({
		instanceId: instance.id,
		body: {
			name: 'Post',
			slug: 'post',
			collection_template_id: websiteDefaultTemplate.id,
			content_template_id: websiteDefaultTemplate.id
		}
	});

	//blocks
	const headerBlock = await createWebsiteBlocksApi({
		instanceId: instance.id,
		body: {
			name: 'Header',
			slug: 'header',
			html: templates.website.blocks.header
		}
	});
	const footerBlock = await createWebsiteBlocksApi({
		instanceId: instance.id,
		body: {
			name: 'Footer',
			slug: 'footer',
			html: templates.website.blocks.footer
		}
	});
	const ctaBlock = await createWebsiteBlocksApi({
		instanceId: instance.id,
		body: {
			name: 'CTA',
			slug: 'cta',
			html: templates.website.blocks.cta
		}
	});

	return {
		website: {
			page: pageContentType,
			post: postContentType,
			templates: {
				default: websiteDefaultTemplate,
				event: websiteEventTemplate,
				petition: websitePetitionTemplate
			},
			blocks: {
				header: headerBlock,
				footer: footerBlock,
				cta: ctaBlock
			}
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
