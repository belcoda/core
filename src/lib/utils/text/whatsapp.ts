import type { Read as Instance } from '$lib/schema/core/instance';
import type { Read as Event } from '$lib/schema/events/events';
import type { Read as Petition } from '$lib/schema/petitions/petitions';
import { formatDate } from './date';

export function renderRegistrationLink(
	instance: Instance,
	event: Event | Petition
): { text: string; url: string } {
	const whatsappPhoneNumberId = instance.settings.communications.whatsapp.phone_number?.replace(
		'+',
		''
	);
	let text = '';
	if (event) {
		if ('starts_at' in event) {
			// Only events have a starts_at attribute
			text = `Hi! I'm interested in ${event.name} [SIGNUP:${event.id}] on ${formatDate(event.starts_at)}`;
		} else {
			text = `Hi! I would like to sign the petition ${event.name} [PETITION:${event.id}]`;
		}
		return {
			text: 'Whatsapp registration link',
			url: `https://wa.me/${whatsappPhoneNumberId}?text=${encodeURIComponent(text)}`
		};
	}
	return {
		text: 'Whatsapp registration link',
		url: `https://wa.me/${whatsappPhoneNumberId}?text=${encodeURIComponent(text)}`
	};
}
