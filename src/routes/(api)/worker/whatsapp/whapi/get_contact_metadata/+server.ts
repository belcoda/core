import { error, json } from '$lib/server';
import { whatsappNumberForVerification } from '$lib/schema/people/channels/channels';
import { parse } from '$lib/schema/valibot';
import { getContactMetadata } from '$lib/server/utils/whapi/contacts';
import { read, update } from '$lib/server/api/people/people';
import * as m from '$lib/paraglide/messages';
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(whatsappNumberForVerification, body);
		const person = await read({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id
		});
		if (!person.phone_number?.whapi_id) {
			return error(
				400,
				'WORKER:/whatsapp/whapi/get_contact_metadata:02',
				m.stock_minor_barbel_zip(),
				'User does not have a whapi_id registered'
			);
		}
		const contactMetadata = await getContactMetadata(person.phone_number.whapi_id);
		await update({
			instance_id: event.locals.instance.id,
			person_id: parsed.person_id,
			body: { whatsapp: contactMetadata },
			queue: event.locals.queue,
			admin_id: event.locals.admin.id,
			options: { skipWhatsappCheck: true } //IMPORTANT: Otherwise we will get in an infinite loop of checking whatsapp
		});

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/whatsapp/whapi/get_contact_metadata:01',
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
