import type { MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => MaybePromise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';
import { pino } from '$lib/server';
import { incomingWebhook } from '$lib/schema/communications/email/received_emails';
import { extract } from 'letterparser';
import { Buffer } from 'buffer';
const log = pino(import.meta.url);
import { parse } from '$lib/schema/valibot';
import { readBySubdomain } from '$lib/server/api/core/instances';
export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	log.info(`📞 ${event.request.method} ${event.url.href}`);
	try {
		const body = await event.request.json();
		const message = JSON.parse(body['Message']);
		const content = Buffer.from(message.content, 'base64').toString();
		const email = extract(content);
		const parsed = parse(incomingWebhook, email);
		try {
			const instance = await readBySubdomain({ subdomain: parsed.to[0].address.split('@')[0] });
			await event.locals.queue(
				'/received/email',
				instance.id,
				parsed,
				instance.settings.default_admin_id
			);
			return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
		} catch (err) {
			log.error(err);
			//@ts-expect-error
			throw new Error(`Could not find instance for email ${parsed.to.address}`);
		}
	} catch (err) {
		log.error(err);
		//but still respond with 200 OK to the webhook
		return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
	}
}
