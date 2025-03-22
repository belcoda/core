import { update as updateSecrets, _readSecretsUnsafe } from '$lib/server/api/core/instances';
import { secrets as secretSchema } from '$lib/schema/core/instance';
import { parse } from '$lib/schema/valibot';
import { json, error } from '$lib/server';
import * as m from '$lib/paraglide/messages';

export async function PUT(event) {
	try {
		const instanceId = event.locals.instance.id;
		const body = await event.request.json();
		const parsed = parse(secretSchema, body.secrets);
		await updateSecrets({
			instanceId,
			body: { secrets: parsed },
			t: event.locals.t
		});
		const secrets = await _readSecretsUnsafe({ instanceId });
		return json(secrets);
	} catch (e) {
		return error(500, 'API:/settings/secrets:PUT:01', m.spry_ago_baboon_cure(), e);
	}
}

export async function GET(event) {
	try {
		const instanceId = event.locals.instance.id;
		const secrets = await _readSecretsUnsafe({ instanceId });
		return json(secrets);
	} catch (err) {
		return error(500, 'API:/settings/secrets:GET:01', m.spry_ago_baboon_cure(), err);
	}
}
