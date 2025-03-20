import Handlebars from 'handlebars';
import { v, parse } from '$lib/schema/valibot';
import type { RequestEvent } from '@sveltejs/kit';
import ERROR_TEMPLATE from './templates/error.hbs?raw';
import * as instanceApi from '$lib/server/api/core/instances';

import { default as handle_event } from '$lib/server/hooks/website/handlers/event';
import { default as handle_petition } from '$lib/server/hooks/website/handlers/petition';
import { default as handle_content } from '$lib/server/hooks/website/handlers/content';

import { pino } from '$lib/server';
const log = pino(import.meta.url);

import { COOKIE_SESSION_NAME } from '$env/static/private';

const errorSchema = v.object({
	error_code: v.optional(v.pipe(v.string(), v.maxLength(500)), 'UNKNOWN'),
	error_message: v.optional(
		v.string(),
		'An unknown error has happened. Please refresh and try again.'
	),
	title: v.optional(v.pipe(v.string(), v.maxLength(500)), 'Error')
});

export default async function (event: RequestEvent, subdomain: string): Promise<Response> {
	try {
		const instance = await instanceApi.readBySubdomain({ subdomain });
		event.locals.instance = instance;

		const method = event.request.method === 'POST' ? 'POST' : 'GET';

		const code = event.cookies.get(COOKIE_SESSION_NAME)
			? event.cookies.get(COOKIE_SESSION_NAME)
			: null;
		const { content_slug, content_type_slug } = read_url({ url: event.url });
		//log.debug({ content_slug, content_type_slug });
		let return_object: Response = new Response();
		switch (content_type_slug) {
			case 'petitions': {
				return_object = await handle_petition({
					instance,
					t: event.locals.t,
					content_slug,
					event,
					code,
					method
				});
				break;
			}
			case 'events': {
				return_object = await handle_event({
					instance,
					t: event.locals.t,
					content_slug,
					event,
					code,
					method
				});
				break;
			}
			case 'surveys': {
				break;
			}
			default: {
				return_object = await handle_content({
					content_type_slug,
					content_slug,
					code,
					method,
					instance,
					t: event.locals.t
				});
				break;
			}
		}
		return return_object;
	} catch (err) {
		//an error has occured
		log.error('error in website_render/handler.ts');
		log.error(err);
		try {
			const parsed = parse(errorSchema, err);
			const template = Handlebars.compile(ERROR_TEMPLATE);
			return new Response(template(parsed), {
				status: 500,
				headers: { 'Content-Type': 'text/html' }
			});
		} catch (err) {
			return new Response('An unknown fatal error has occured', { status: 500 });
		}
	}
}

export function read_url({ url }: { url: URL }): {
	content_type_slug: string;
	content_slug: string | null | undefined | '';
} {
	//url pathname is like "/foo/bar"
	const path = url.pathname.split('/'); //result will be something like ['','foo','bar'];
	const content_type_slug = path[1];
	const content_slug = path[2];
	return { content_type_slug, content_slug };
}
