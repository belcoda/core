import type { MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit';
type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => MaybePromise<Response>;
import type { HandlerResponse } from '$lib/server/hooks/handlers';
import { incomingWebhook } from '$lib/schema/communications/whatsapp/whapi/incoming';
import { parse } from '$lib/schema/valibot';
import { _getInstanceIdByWhatsappGroupChatId } from '$lib/server/api/people/groups';
import { read } from '$lib/server/api/core/instances';
import { pino } from '$lib/server';
const log = pino(import.meta.url);

export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	try {
		log.info(`🌥️💜 ${event.request.method} ${event.url.href}`);
		const body = await event.request.json();
		const parsed = parse(incomingWebhook, body);
		if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
			const message = parsed.messages[0];
			log.debug(message);
			const instance_id = await _getInstanceIdByWhatsappGroupChatId({
				whatsappId: message.chat_id,
				t: event.locals.t
			});
			const instance = await read({ instance_id: instance_id });
			await event.locals.queue(
				'/whatsapp/whapi/webhook',
				instance.id,
				parsed,
				instance.settings.default_admin_id
			);
		}

		//convert from income to message....
		return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
	} catch (err) {
		log.error(err);
		//but still respond with 200 OK to the webhook
		return { continue: false, response: new Response('200 OK HTTPS', { status: 200 }) };
	}
}
