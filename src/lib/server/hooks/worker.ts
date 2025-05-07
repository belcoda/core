import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { pino } from '$lib/server';
const log = pino(import.meta.url);
import { buildAdminInstance } from '$lib/server/hooks/build_locals';

import { buildLocalLanguage } from '$lib/server/hooks/build_locals';
import { Localization } from '$lib/i18n';

import { v, id, parse } from '$lib/schema/valibot';

const schema = v.object({ instance_id: id, admin_id: id });

import { read as adminApi } from '$lib/server/api/core/admins';
import { read as instanceApi } from '$lib/server/api/core/instances';

import { GRAPHILE_WORKER_TOKEN } from '$env/static/private';

export type HandlerResponse =
	| {
			continue: true;
			response: null;
	  }
	| {
			continue: false;
			response: Response;
	  };

type Resolve = (event: RequestEvent, opts?: ResolveOptions | undefined) => Promise<Response>;

export default async function (event: RequestEvent, resolve: Resolve): Promise<HandlerResponse> {
	if (event.url.pathname.startsWith('/worker')) {
		if (event.request.headers.get('Authorization') !== `Bearer ${GRAPHILE_WORKER_TOKEN}`) {
			return {
				continue: false,
				response: new Response(null, {
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				})
			};
		} else {
			try {
				event.locals.language = buildLocalLanguage(event);
				event.locals.t = new Localization(event.locals.language);

				//it's a cron job, it doesnt have admin or anything
				if (event.url.pathname.startsWith('/worker/cron')) {
					const response = await resolve(event);
					return { continue: false, response: response };
				}

				const params = {
					admin_id: Number(event.url.searchParams.get('admin_id')),
					instance_id: Number(event.url.searchParams.get('instance_id'))
				};
				const parsed = parse(schema, params);

				event.locals.instance = await instanceApi({ instance_id: parsed.instance_id });
				event.locals.admin = await adminApi({
					admin_id: parsed.admin_id,
					instance_id: parsed.instance_id,
					t: event.locals.t
				});
				const response = await resolve(event);
				return { continue: false, response: response };
			} catch (err) {
				log.error(err);
				return {
					continue: false,
					response: new Response(null, {
						status: 400,
						headers: { 'Content-Type': 'application/json' }
					})
				};
			}
		}
	} else {
		return { continue: true, response: null };
	}
}
