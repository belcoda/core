import type { RequestEvent } from '@sveltejs/kit';

import renderHandlebarsTemplate from '$lib/server/utils/handlebars/render';
import {
	render,
	compile_custom_code,
	type RenderContext,
	type RenderStatus
} from '$lib/server/hooks/website/render';
import { pino } from '$lib/server';
const log = pino(import.meta.url);
const error404 = {
	title: 'Error',
	error_code: 'Error 404',
	error_message: 'Page not found'
};

import petitionsPageTemplate from '$lib/server/templates/website/petitions/default.hbs?raw';
import petitionsPageCopy from '$lib/server/templates/website/petitions/default.copy';
import utilsCopy from '$lib/server/templates/website/blocks/utils/utils.copy';

import { readBySlug as readPetitionBySlug } from '$lib/server/api/petitions/petitions';

import { petitionSignature, signatureQueueMessage } from '$lib/schema/petitions/petitions';
import { parse, type TemplateGlobals } from '$lib/schema/valibot';

export default async function ({
	instance,
	content_slug,
	code,
	t,
	method,
	event
}: {
	content_slug: string | null | undefined;
	code: string | null | undefined;
	method: 'GET' | 'POST';
	instance: App.Locals['instance'];
	t: App.Localization;
	event: RequestEvent;
}): Promise<Response> {
	let status: RenderStatus = { success: false, error: null };
	if (!content_slug) throw error404;

	const petitionObject = await readPetitionBySlug({
		instanceId: instance.id,
		slug: content_slug
	}).catch((err) => {
		log.error('Error reading petition');
		log.error(err);
		throw error404;
	});

	if (method === 'POST') {
		try {
			const formBody = await event.request.formData();
			const body = Object.fromEntries(formBody);
			const parsed = parse(petitionSignature, {
				...body,
				country: event.locals.instance.country,
				opt_in: Boolean(body.opt_in)
			});
			const queueMessage = parse(signatureQueueMessage, {
				petition_id: petitionObject.id,
				signup: parsed
			});
			await event.locals.queue(
				'petitions/signature',
				instance.id,
				queueMessage,
				instance.settings.default_admin_id
			);
			status.success = true;
		} catch (err) {
			if (err instanceof Error) {
				status.error = err.message;
			} else {
				status.error = event.locals.t.errors.generic();
			}
		}
	}

	const globals: TemplateGlobals = {
		url: `https://${instance.slug}.belcoda.com/petitions/${petitionObject.slug}`,
		encoded_url: encodeURIComponent(
			`https://${instance.slug}.belcoda.com/petitions/${petitionObject.slug}`
		)
	};

	const output = await renderHandlebarsTemplate({
		template: petitionsPageTemplate,
		instanceId: instance.id,
		context: {
			petition: petitionObject,
			status,
			instance,
			globals,
			copy: { event: petitionsPageCopy(), utils: utilsCopy() }
		},
		t
	});

	//this is needed to avoid the error: "Cannot read property 'custom_css' of undefined"
	const DEFAULT_CUSTOM_TEMPLATE_CODE = {
		custom_html_head: '',
		custom_html_body: '',
		custom_css: '',
		custom_js: ''
	};

	const custom_code = compile_custom_code(petitionObject, DEFAULT_CUSTOM_TEMPLATE_CODE);
	const final = render({
		context: { petition: petitionObject, status, instance },
		renderedContent: output,
		customCode: custom_code,
		metatags: petitionObject.html_metatags
	});

	return new Response(final, {
		status: 200,
		headers: {
			'Content-Type': 'text/html'
		}
	});
}
