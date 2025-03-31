import { error, pino, json as returnJson } from '$lib/server';

import sendEmailPostmark from '$lib/server/utils/email/send_email_postmark';
import { v, parse, id } from '$lib/schema/valibot';
import { read as readAdmin } from '$lib/server/api/core/admins';
import * as m from '$lib/paraglide/messages';
const exportSchema = v.object({
	adminId: id
});
const log = pino(import.meta.url);
import {
	OFAC_API_KEY,
	OFAC_DATA_SOURCES_ARRAY,
	OFAC_MATCH_SEND_FROM,
	OFAC_MATCH_SEND_RECIPIENT,
	OFAC_API_URL
} from '$env/static/private';
const DATA_SOURCES = OFAC_DATA_SOURCES_ARRAY.split(',');
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(exportSchema, body);
		const admin = await readAdmin({
			instance_id: event.locals.instance.id,
			admin_id: parsed.adminId,
			t: event.locals.t
		});
		const sendBody = {
			apiKey: OFAC_API_KEY,
			minScore: 95, //recommended by ofac-api.com documentation for the best results
			sources: DATA_SOURCES,
			types: ['person'],
			cases: [
				{
					id: parsed.adminId,
					name: admin.full_name,
					emailAddress: admin.email,
					nationality: event.locals.instance.country
				}
			]
		};
		const result = await fetch(OFAC_API_URL, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(sendBody)
		});
		log.debug(`OFAC API Response ${result.status}`);
		const json = await result.json();
		if (json.error) {
			log.debug('Error in response');
			throw new Error(json.error);
		}
		if (json.results[0].matchCount === 0) {
			const subject = `OFAC_SANCTION:NOMATCH`;
			const body = `No match for newly added admin ID ${admin.id} in OFAC database`;
			await sendEmailPostmark({
				to: OFAC_MATCH_SEND_RECIPIENT,
				from: OFAC_MATCH_SEND_FROM,
				subject,
				html: body,
				replyTo: OFAC_MATCH_SEND_FROM,
				stream: 'outbound'
			});
		} else {
			const subject = `OFAC_SANCTION:MATCH`;
			const body = `Match found for newly added admin ID ${admin.id} in OFAC database
      
      ${JSON.stringify(json.results[0].matches)}`;
			await sendEmailPostmark({
				to: OFAC_MATCH_SEND_RECIPIENT,
				from: OFAC_MATCH_SEND_FROM,
				subject,
				html: body,
				replyTo: OFAC_MATCH_SEND_FROM,
				stream: 'outbound'
			});
		}
		return returnJson({ success: true });
	} catch (err) {
		return error(500, 'worker:utils/people/match_saction:POST:01', m.spry_ago_baboon_cure(), err);
	}
}
