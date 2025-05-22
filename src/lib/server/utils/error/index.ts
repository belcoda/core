import { randomUUID } from 'crypto';
import { renderValiError } from '$lib/schema/valibot';
import { pino } from '$lib/server/utils/logs/pino';
const log = pino(import.meta.url);
import { BelcodaError } from '$lib/server/utils/error/BelcodaError';
import { error as returnError, type NumericRange } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';
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
