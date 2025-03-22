import { valibot, superValidate, formAction, redirect } from '$lib/server';
import { update, read } from '$lib/schema/core/instance';
import { parse } from '$lib/schema/valibot';
import { setLocale } from '$lib/paraglide/runtime.js';
import { Localization } from '$lib/i18n';
import { PUBLIC_LOCALIZATION_COOKIE_NAME } from '$env/static/public';
import * as m from '$lib/paraglide/messages';
export async function load(event) {
	const form = await superValidate(event.locals.instance, valibot(update));
	return { form };
}

export const actions = {
	default: async function (event) {
		const output = await formAction({
			event,
			url: '/api/v1/settings/language',
			method: 'PUT',
			inputSchema: update
		});
		if (output.error) return output.output;
		const parsed = parse(read, output.output);
		event.locals.instance = parsed;
		event.locals.language = parsed.language;
		event.cookies.set(PUBLIC_LOCALIZATION_COOKIE_NAME, parsed.language, {
			httpOnly: false,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
			path: '/'
		});
		setLocale(parsed.language); //sets the language tag in the server runtime for the current request
		event.locals.t = new Localization(event.locals.language);
		return redirect(event, {
			message: m.fine_tiny_grebe_zip()
		});
	}
};
