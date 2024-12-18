import { handleApiFaviconRequest } from '$lib/server/hooks/simple_handlers';
import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { pino } from '$lib/server';
const log = pino('$lib/server/hooks/handlers');
import whatsappHandler from '$lib/server/hooks/whatsapp/ycloud';
import whapiHandler from '$lib/server/hooks/whapi';
import emailHandler from '$lib/server/hooks/email/postmark';
const SUBDOMAIN_LIST = ['admin', 'app', 'dashboard', 'localhost', 'www', 'localhost:5173']; //list of subdomains that are not site subdomains
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
		const subdomain = event.url.host.split('.')[0];
		if (!SUBDOMAIN_LIST.includes(subdomain)) {
			//there is a subdomain, and it's not in the list of functinoal subdomains (eg: admin. app. dashboard. etc)... that means it's a site subdomain.
			log.info(`🎣 Request subdomain is ${subdomain}`);
			const response = await handlePageRender(event, subdomain);
			return { continue: false, response: response };
		}
	}

	return handleApiFaviconRequest(event);
}
