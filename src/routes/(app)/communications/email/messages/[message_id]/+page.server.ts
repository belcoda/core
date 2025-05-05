import {
	loadError,
	pino,
	type Infer,
	BelcodaError,
	returnMessage,
	redirect,
	message,
	superValidate,
	formAction,
	valibot
} from '$lib/server';

import { redirect as baseRedirect } from '@sveltejs/kit';
import {
	read,
	update,
	type Create,
	create as createMessage
} from '$lib/schema/communications/email/messages';
import { list as listSends, create as createSend } from '$lib/schema/communications/email/sends';
import { parse } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';

import { randomUUID } from 'crypto';

const log = pino(import.meta.url);

export async function load(event) {
	const response = await event.fetch(
		`/api/v1/communications/email/messages/${event.params.message_id}`
	);
	if (!response.ok) return loadError(response);
	const body = await response.json();
	const parsed = parse(read, body);

	const sendsResponse = await event.fetch(
		`/api/v1/communications/email/messages/${event.params.message_id}/sends`
	);
	if (!sendsResponse.ok) return loadError(sendsResponse);
	const sendsBody = await sendsResponse.json();
	const sendsParsed = parse(listSends, sendsBody);

	const form = await superValidate(parsed, valibot(update));

	const sendsForm = await superValidate(
		{ message_id: parsed.id, name: randomUUID() },
		valibot(createSend)
	);

	return {
		message: parsed,
		sends: sendsParsed,
		form,
		sendsForm,
		pageTitle: [{ key: 'MESSAGEID', title: body.id }]
	};
}

export const actions = {
	duplicate: async function (event) {
		const msgResponse = await event.fetch(
			`/api/v1/communications/email/messages/${event.params.message_id}`
		);

		if (!msgResponse.ok) {
			return redirect(event, {
				location: `/communications/email/messages/${event.params.message_id}`,
				type: 'error',
				message: m.bad_tidy_antelope_boil()
			});
		}

		const msgBody = await msgResponse.json();
		const msgParsed = parse(read, msgBody);

		const newMessageName = m.slow_clear_nuthatch_tickle({ oldMessageName: msgParsed.name });
		const createBody = parse(createMessage, {
			...msgParsed,
			name: newMessageName
		});

		const response = await event.fetch(`/api/v1/communications/email/messages`, {
			method: 'POST',
			body: JSON.stringify(createBody),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			log.debug(response.status, 'status');
			log.debug(await response.text(), 'body');
			return redirect(event, {
				location: `/communications/email/messages/${event.params.message_id}`,
				type: 'error',
				message: m.bad_tidy_antelope_boil()
			});
		}
		const body = await response.json();
		const parsed = parse(read, body);
		log.debug(parsed, 'parsed');
		return redirect(event, {
			location: `/communications/email/messages/${parsed.id}`,
			message: m.flat_sleek_millipede_agree()
		});
	},
	update: async function (event) {
		const output = await formAction({
			method: 'PUT',
			url: `/api/v1/communications/email/messages/${event.params.message_id}`,
			event,
			inputSchema: update
		});
		if (output.error) {
			return output.output;
		} else {
			const parsed = parse(read, output.output);
			return redirect(event, {
				location: `/communications/email/messages/${parsed.id}`,
				type: 'error',
				message: m.flat_sleek_millipede_agree()
			});
		}
	}
};
