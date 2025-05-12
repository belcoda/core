import { superValidate, valibot, formAction, redirect, pino, loadError } from '$lib/server';
import * as m from '$lib/paraglide/messages';
import { error } from '@sveltejs/kit';
import { update, read } from '$lib/schema/communications/email/from_signatures';
import { parse } from '$lib/schema/valibot';
import { v4 as uuidv4 } from 'uuid';
const log = pino(import.meta.url);
export async function load(event) {
	const response = await event.fetch(
		`/api/v1/communications/email/from_signatures/${event.params.from_signature_id}`
	);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);
	const form = await superValidate(parsed, valibot(update));
	return { form };
}

export const actions = {
	update: async function post(event) {
		const response = await formAction({
			event,
			url: `/api/v1/communications/email/from_signatures/${event.params.from_signature_id}`,
			method: 'PUT',
			inputSchema: update
		});
		if (response.error) return response.output;
		const parsed = parse(read, response.output);
		return redirect(event, {
			location: `/settings/email/from_signatures/${parsed.id}`,
			message: m.white_acidic_koala_pop()
		});
	},
	verify: async function post(event) {
		const response = await event.fetch(
			`/api/v1/communications/email/from_signatures/${event.params.from_signature_id}/verify`,
			{
				method: 'PUT'
			}
		);
		if (response.ok) {
			const body = await response.json();
			const parsed = parse(read, body);
			return redirect(event, {
				location: `/settings/email/from_signatures/${parsed.id}`,
				message: m.white_acidic_koala_pop()
			});
		}
		return error(response.status, {
			error: true,
			id: uuidv4(),
			name: 'DATA:COMMUNICATIONS:FROM_SIGNATURES:VERIFY:01',
			message: m.white_acidic_koala_pop()
		});
	}
};
