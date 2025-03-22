import { error, json, pino } from '$lib/server';
import { whatsappNumberForVerification } from '$lib/schema/people/channels/channels';
import { parse } from '$lib/schema/valibot';
import { checkContact } from '$lib/server/utils/whapi/contacts';
import { read, update } from '$lib/server/api/people/people';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(whatsappNumberForVerification, body);
		log.debug(parsed);
		const person = await read({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			t: event.locals.t
		});
		if (!person.phone_number) {
			return error(
				400,
				'WORKER:/whatsapp/whapi/check_phone_number:02',
				m.stock_minor_barbel_zip(),
				'User does not have a phone number'
			);
		}
		const contactStatus = await checkContact(person.phone_number.phone_number);
		if (contactStatus.status === 'valid') {
			const newPhoneNumber = {
				...person.phone_number,
				whatsapp: true,
				whapi_id: contactStatus.wa_id
			};
			const updated = await update({
				instance_id: event.locals.instance.id,
				person_id: parsed.person_id,
				body: { phone_number: newPhoneNumber },
				t: event.locals.t,
				queue: event.locals.queue,
				admin_id: event.locals.admin.id,
				options: { skipWhatsappCheck: true } //IMPORTANT: Otherwise we will get in an infinite loop of checking whatsapp
			});
			const randomFutureDate = randomDate();
			const sendToMetadata = parse(whatsappNumberForVerification, { person_id: parsed.person_id });
			await event.locals.queue(
				'/whatsapp/whapi/get_contact_metadata',
				event.locals.instance.id,
				sendToMetadata,
				event.locals.admin.id,
				{ runAt: randomFutureDate }
			);
			log.debug(
				`Queued get_contact_metadata for ${secondsFromNow(randomFutureDate)} seconds from now`
			);
		}
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/whatsapp/whapi/check_phone_number:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

//This generates a random future date between 7 and 89 seconds from now which is soon enough but hopefully realistic enough to not appear to be inauthentic activity
function randomDate(): Date {
	const minSeconds = 7;
	const maxSeconds = 89;
	const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
	return new Date(Date.now() + randomSeconds * 1000);
}

function secondsFromNow(date: Date): number {
	const now = Date.now();
	const inputTime = date.getTime();
	const differenceInMilliseconds = inputTime - now;
	return Math.floor(differenceInMilliseconds / 1000);
}
