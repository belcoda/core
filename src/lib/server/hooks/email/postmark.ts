import type { MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => MaybePromise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';
import { pino } from '$lib/server';
import { incomingPostmarkWebhook } from '$lib/schema/communications/email/received_emails';
const log = pino(import.meta.url);
import { parse } from '$lib/schema/valibot';
import { readBySubdomain } from '$lib/server/api/core/instances';
import { POSTMARK_INBOUND_WEBHOOK_TOKEN } from '$env/static/private';
export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	log.info(`📞 ${event.request.method} ${event.url.href}`);
	try {
		const inboundToken = event.url.searchParams.get('token');
		if (inboundToken !== POSTMARK_INBOUND_WEBHOOK_TOKEN) {
			return { continue: false, response: new Response('403 Forbidden HTTPS', { status: 403 }) };
		}
		const body = await event.request.json();
		const parsed = parse(incomingPostmarkWebhook, body);
		log.info(`📧 Received email from ${parsed.ToFull[0]?.Email}`);
		try {
			const subdomain = parsed.ToFull[0]?.Email.split('@')[0];
			log.info(`🔍 Looking for instance with subdomain ${subdomain}`);
			const instance = await readBySubdomain({ subdomain: subdomain });
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
