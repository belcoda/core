import { handleApiFaviconRequest } from '$lib/server/hooks/simple_handlers';
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { pino } from '$lib/server';
const log = pino('$lib/server/hooks/handlers');
import whatsappHandler from '$lib/server/hooks/whatsapp/ycloud';
import whapiHandler from '$lib/server/hooks/whapi';
import emailHandler from '$lib/server/hooks/email/postmark';
import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';
import worker from '$lib/server/hooks/worker';
import { default as handlePageRender } from '$lib/server/hooks/website/handler';
type MaybePromise<T> = T | Promise<T>;
export type HandlerResponse =
	| {
			continue: true;
			response: null;
	  }
	| {
			continue: false;
			response: Response;
	  };

type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => MaybePromise<Response>;

export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	if (event.url.pathname.startsWith('/api/v1')) {
		log.info(`✨ ${event.request.method} ${event.url.href}`);
	} else {
		log.info(`🌎 ${event.request.method} ${event.url.href}`);
	}
	if (event.url.pathname.startsWith('/webhooks/email')) {
		return await emailHandler(event, resolve);
	}
	if (event.url.pathname.startsWith('/favicon.ico')) {
		return { continue: false, response: new Response(null, { status: 204 }) };
	}
	if (event.url.pathname.startsWith('/webhooks/whatsapp')) {
		return await whatsappHandler(event, resolve);
	}

	if (event.url.pathname.startsWith('/webhooks/whapi')) {
		return await whapiHandler(event, resolve);
	}

	const workerResponse = await worker(event, resolve);
	if (!workerResponse.continue) return { continue: false, response: workerResponse.response };

	if (event.url.host.split('.')[0]) {
		const subdomain = detectSubdomain(event.url.host, PUBLIC_ROOT_DOMAIN);
		if (subdomain) {
			log.info(`🎣 Request subdomain is ${subdomain}`);
			const response = await handlePageRender(event, subdomain);
			return { continue: false, response: response };
		}
	}

	return handleApiFaviconRequest(event);
}
import { DISALLOWED_NAMES_SET } from '$lib/utils/text/bad_names';
export function detectSubdomain(host: string, rootDomain: string): string | false {
	if (host === rootDomain) {
		return false;
	}

	const parts = host.split('.');
	// if it's a single-part domain (eg: example.com), then domain.split('.').length === 2 means it's root
	if (parts.length < 3) {
		// note that this will false-negative for domains like .com.au or .co.uk or .co.jp, but they should all be covered by the root check domain above

		if (parts[parts.length - 1].includes('localhost') === false) {
			//subdomain.localhost:5173 is a valid subdomain but has less than 3 parts when split by '.'
			return false;
		}
	}

	if (DISALLOWED_NAMES_SET.has(parts[0])) {
		// includes things like 'www', as well as 'dashboard', which was a previous hosted URL
		return false;
	}

	const subdomain = parts[0];
	return subdomain;
}
