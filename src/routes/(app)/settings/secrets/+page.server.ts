import { update, secrets as secretsSchema, updateSecrets } from '$lib/schema/core/instance.js';
import { superValidate, valibot, redirect } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import { formAction } from '$lib/server';
import * as m from '$lib/paraglide/messages';
export const load = async (event) => {
	const services = await event.fetch(`/api/v1/settings/secrets`);
	const body = await services.json();
	const parsed = parse(secretsSchema, body);
	const formData = {
		secrets: parsed
	};
	const form = await superValidate(formData, valibot(updateSecrets));
	return {
		form,
		services: Object.entries(parsed).map(([key, value]) => ({ key, value }))
	};
};

export const actions = {
	default: async function post(event) {
		const { output, error } = await formAction({
			event,
			url: '/api/v1/settings/secrets',
			inputSchema: update,
			method: 'PUT'
		});
		if (error) return output;
		parse(secretsSchema, output); // To make sure we throw an error if the response is not what we expect
		return redirect(event, {
			location: `/settings/secrets`,
			message: m.white_acidic_koala_pop()
		});
		/* const form = await superValidate<Infer<typeof update>, BelcodaError>(
			event.request,
			valibot(update)
		);

		if (!form.valid) {
			return message(
				form,
				new BelcodaError(400, 'VALIDATION', m.spare_mushy_dachshund_quell()),
				{ status: 400 }
			);
		}

		await updateSecrets({
			instanceId: event.locals.instance.id,
			body: { secrets: form.data.secrets },
			t: event.locals.t
		});
 */
	}
};
