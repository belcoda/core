export { db, pool, type s } from '$lib/server/utils/db/index';
export { pino } from '$lib/server/utils/logs/pino';
export * as redis from '$lib/server/utils/redis';
export { json } from '@sveltejs/kit';
export { filterQuery } from '$lib/server/utils/filters/filter';

import * as m from '$lib/paraglide/messages';

import { pino } from '$lib/server';
const log = pino(import.meta.url);
import { error as returnError, type NumericRange } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { renderValiError } from '$lib/schema/valibot';

export class BelcodaError extends Error {
	public code: NumericRange<400, 599>;
	public error?: Error | unknown;
	constructor(
		code: NumericRange<400, 599>,
		name: string,
		message: string,
		error?: Error | unknown
	) {
		super(message);
		this.code = code;
		this.name = name;
		this.error = error;
	}
}

export function error(code: NumericRange<400, 599>, name: string, message: string, err?: unknown) {
	const id = randomUUID();
	if (err) {
		const valiErrorOutput = renderValiError(err);
		if (valiErrorOutput.isValiError) {
			log.error(`❌ Validation Error 400 [${name}] ${valiErrorOutput.message}} [${id}]`);
			return returnError(400, {
				error: true,
				name: name,
				message: `${m.cozy_shy_jackal_revive()} ${valiErrorOutput.message}`,
				id: id
			});
		}
		if (err instanceof BelcodaError) {
			// therefore not a validation Error
			log.error(`❌ BelcodaError ${err.code} (${err.name}) ${err.message} [${id}] ❌`);
			if (err.error) log.error(err.error);
			return returnError(err.code, {
				error: true,
				name: err.name,
				message: err.message,
				id: id
			});
		}
		if (err instanceof Error) {
			log.error(`❌ Error (${err.name}) ${err.message} [${id}] ❌`);
			log.error(err);
			return returnError(code, {
				error: true,
				name: err.name,
				message: err.message,
				id: id
			});
		}
	} else {
		log.error(`❌ Error ${code} (${name}) ${message} [${id}] ❌`);
		return returnError(code, {
			error: true,
			name: name,
			message: message,
			id: id
		});
	}

	log.error(`❌ ERROR ${code} (${name}) ${message} [${id}] ❌`);
	return returnError(code, {
		error: true,
		name: name,
		message: message,
		id: id
	});
}

import type { RequestEvent } from '@sveltejs/kit';
import { redirect as sveltekit_flash_redirect } from 'sveltekit-flash-message/server';
import { superValidate, type Infer } from 'sveltekit-superforms';
export { superValidate, type Infer };
import { message as formMessage, type SuperValidated } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
export { valibot };

type RedirectOptions = {
	type?: 'success' | 'error';
	message: string;
	location?: string;
	code?: NumericRange<300, 399>;
};
export function redirect(event: RequestEvent, options: RedirectOptions): void {
	if (options.location && options.code)
		return sveltekit_flash_redirect(
			options.code,
			options.location,
			{ type: options.type || 'success', message: options.message },
			event
		);
	if (options.location)
		return sveltekit_flash_redirect(
			options.location,
			{ type: options.type || 'success', message: options.message },
			event
		);
	return sveltekit_flash_redirect(
		{ type: options.type || 'success', message: options.message },
		event
	);
}

import { v } from '$lib/schema/valibot';

export const errorSchema = v.object({
	error: v.optional(v.literal(true), true),
	name: v.optional(v.string(), 'Unknown Error'),
	message: v.optional(v.string(), 'An unknown error has occured'),
	id: v.optional(v.string(), 'UD: UNKNOWN'),
	code: v.optional(v.pipe(v.number(), v.integer(), v.minValue(400), v.maxValue(599)), 500)
});
export type ErrorSchema = {
	error: true;
	name: string;
	message: string;
	id: string;
	code: NumericRange<400, 599>;
};

export async function loadError(response: Response) {
	const json = await response.json();
	const parsedError = v.parse(errorSchema, json);
	return returnError(response.status as NumericRange<400, 599>, parsedError);
}

export async function returnMessage(response: Response, form: SuperValidated<any, any, any>) {
	try {
		const body = await response.json();
		const parsed = v.parse(errorSchema, body);
		return formMessage(form, parsed, { status: response.status as NumericRange<400, 599> });
	} catch (err) {
		const parsed = v.parse(errorSchema, { error: true });
		return formMessage(form, parsed, { status: 500 });
	}
}

export { formMessage as message };

export function filter(path: string, url: URL) {
	return `${path}${url.searchParams.toString().length ? `?${url.searchParams.toString()}` : ''}`;
}

import { type ObjectSchema } from 'valibot';
export async function formAction({
	method,
	url,
	event,
	inputSchema
}: {
	method: 'PUT' | 'POST';
	url: string;
	event: RequestEvent;
	inputSchema: ObjectSchema<any, any>;
}): Promise<
	{ error: false; output: unknown } | { error: true; output: ReturnType<typeof formMessage> }
> {
	const form = await superValidate<Infer<typeof inputSchema>, BelcodaError>(
		event.request,
		valibot(inputSchema)
	);
	try {
		if (!form.valid) {
			return {
				error: true,
				output: formMessage(
					form,
					new BelcodaError(400, 'VALIDATION', m.sharp_less_shrimp_greet()),
					{ status: 400 }
				)
			};
		}
		const response = await event.fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data)
		});

		if (!response.ok) {
			try {
				const body = await response.json();
				const parsed = v.parse(errorSchema, body);
				return {
					error: true,
					output: formMessage(form, parsed as ErrorSchema, {
						status: response.status as NumericRange<400, 599>
					})
				};
			} catch (err) {
				const parsed = v.parse(errorSchema, { error: true });
				return { error: true, output: formMessage(form, parsed as ErrorSchema, { status: 500 }) };
			}
		}
		const body = await response.json();
		return { error: false, output: body };
	} catch (err) {
		return { error: true, output: formMessage(form, err, { status: 500 }) };
	}
}
