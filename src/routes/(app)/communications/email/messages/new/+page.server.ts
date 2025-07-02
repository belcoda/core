import { formAction, valibot, superValidate, redirect, loadError } from '$lib/server';
import { create, read } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
import { list as listFromSignatures } from '$lib/schema/communications/email/from_signatures';
import * as m from '$lib/paraglide/messages';
//load form
export async function load(event) {
	const fromSignatureResponse = await event.fetch(`/api/v1/communications/email/from_signatures`);
	if (!fromSignatureResponse.ok) return loadError(fromSignatureResponse);
	const fromSignatureBody = await fromSignatureResponse.json();
	const fromSignatureParsed = parse(listFromSignatures, fromSignatureBody);

	const form = await superValidate(
		{
			point_person_id: event.locals.admin.id,
			from: event.locals.instance.settings.communications.email.default_from_name,
			reply_to: `${event.locals.instance.slug}@belcoda.com`
		},
		valibot(create)
	);
	return { form, fromSignatures: fromSignatureParsed };
}

//handle form submission to create new message...
export const actions = {
	default: async function (event) {
		const result = await formAction({
			method: 'POST',
			url: '/api/v1/communications/email/messages',
			event,
			inputSchema: create
		});
		if (result.error) {
			return result.output;
		}

		const parsed = parse(read, result.output);
		return redirect(event, {
			location: `/communications/email/messages/${parsed.id}`,
			message: m.flat_sleek_millipede_agree()
		});
	}
};
