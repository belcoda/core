import type { RequestEvent } from '@sveltejs/kit';

import eventPageTemplate from '$lib/server/templates/website/events/default.hbs?raw';
import eventPageCopy from '$lib/server/templates/website/events/default.copy';
import utilsCopy from '$lib/server/templates/website/blocks/utils/utils.copy';

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

import { readBySlug as readEventBySlug } from '$lib/server/api/events/events';

import { eventSignup, signUpQueueMessage } from '$lib/schema/events/events';
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

	const eventObject = await readEventBySlug({
		instanceId: instance.id,
		slug: content_slug
	}).catch((err) => {
		log.error('Error reading event');
		log.error(err);
		throw error404;
	});

	if (method === 'POST') {
		try {
			const formBody = await event.request.formData();
			const body = Object.fromEntries(formBody);
			const parsed = parse(eventSignup, {
				...body,
				country: event.locals.instance.country,
				opt_in: Boolean(body.opt_in)
			});
			const queueMessage = parse(signUpQueueMessage, { event_id: eventObject.id, signup: parsed });
			await event.locals.queue(
				'events/registration',
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
		url: `https://${instance.slug}.belcoda.com/events/${eventObject.slug}`,
		encoded_url: encodeURIComponent(
			`https://${instance.slug}.belcoda.com/events/${eventObject.slug}`
		)
	};

	const output = await renderHandlebarsTemplate({
		template: eventPageTemplate,
		instanceId: instance.id,
		context: {
			event: eventObject,
			status,
			instance,
			globals,
			copy: { event: eventPageCopy(), utils: utilsCopy() }
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

	const custom_code = compile_custom_code(eventObject, DEFAULT_CUSTOM_TEMPLATE_CODE);
	const final = render({
		context: { event: eventObject, status, instance },
		renderedContent: output,
		customCode: custom_code,
		metatags: eventObject.html_metatags
	});

	return new Response(final, {
		status: 200,
		headers: {
			'Content-Type': 'text/html'
		}
	});
}
