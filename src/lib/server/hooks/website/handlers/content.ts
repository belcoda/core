import renderHandlebarsTemplate from '$lib/server/utils/handlebars/render';

import { readBySlug as readContentTypeBySlug } from '$lib/server/api/website/content_types';
import { readBySlug as readContentBySlug } from '$lib/server/api/website/content';

import {
	render,
	compile_custom_code,
	type RenderContext,
	type RenderStatus
} from '$lib/server/hooks/website/render';

import { pino } from '$lib/server';

import contentDefaultTemplate from '$lib/server/templates/website/content/default.hbs?raw';
import contentPageTemplate from '$lib/server/templates/website/content/page.hbs?raw';
import contentPostTemplate from '$lib/server/templates/website/content/post.hbs?raw';
const templates = {
	page: contentPageTemplate,
	post: contentPostTemplate,
	default: contentDefaultTemplate
};
import contentPageCopy from '$lib/server/templates/website/content/default.copy';
import utilsCopy from '$lib/server/templates/website/blocks/utils/utils.copy';

import { parse, type TemplateGlobals } from '$lib/schema/valibot';

import { error500, error404 } from '$lib/server/hooks/website/handlers/errors';
const log = pino(import.meta.url);

export default async function ({
	content_slug,
	content_type_slug,
	code,
	method,
	instance,
	t
}: {
	content_type_slug: string | null | undefined;
	content_slug: string | null | undefined;
	code: string | null | undefined;
	method: 'GET' | 'POST';
	instance: App.Locals['instance'];
	t: App.Localization;
}): Promise<Response> {
	let status = { success: false, error: null };
	if (!content_slug) throw error404;
	if (!content_type_slug) throw error404;

	if (method === 'POST') {
		// TODO: Handle regular content POST method
	}

	const contentType = await readContentTypeBySlug({
		instanceId: instance.id,
		slug: content_type_slug,
		t: t
	}).catch((err) => {
		log.error('Error reading content type');
		log.error(err);
		throw error404;
	});

	// Get the correct template to correspond with the content type
	// Type casting here should be okay becuse there is a fallback to the default template if needed
	const contentTemplate = templates[contentType.slug as 'post' | 'page'] ?? contentDefaultTemplate;

	const content = await readContentBySlug({
		instanceId: instance.id,
		slug: content_slug,
		contentTypeId: contentType.id,
		t: t
	}).catch((err) => {
		log.error('Error reading content');
		log.error(err);
		throw error404;
	});

	const globals: TemplateGlobals = {
		url: `https://${instance.slug}.belcoda.com/${contentType.slug}/${content.slug}`,
		encoded_url: encodeURIComponent(
			`https://${instance.slug}.belcoda.com/${contentType.slug}/${content.slug}`
		)
	};

	const output = await renderHandlebarsTemplate({
		template: contentTemplate,
		instanceId: instance.id,
		context: {
			content: content,
			status,
			instance,
			globals,
			copy: { event: contentPageCopy(), utils: utilsCopy() }
		},
		t
	}).catch((err) => {
		log.error('Error rendering content');
		log.error(err);
		throw error500;
	});

	//this is needed to avoid the error: "Cannot read property 'custom_css' of undefined"
	const DEFAULT_CUSTOM_TEMPLATE_CODE = {
		custom_html_head: '',
		custom_html_body: '',
		custom_css: '',
		custom_js: ''
	};

	const custom_code = compile_custom_code(content, DEFAULT_CUSTOM_TEMPLATE_CODE);
	const final = render({
		renderedContent: output,
		context: { content: content, status, instance },
		customCode: custom_code,
		metatags: content.html_metatags
	});

	return new Response(final, {
		status: 200,
		headers: {
			'Content-Type': 'text/html'
		}
	});
}
