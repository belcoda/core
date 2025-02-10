import type { Read as Instance } from '$lib/schema/core/instance';
import type { Read as Event } from '$lib/schema/events/events';
import { formatDate } from './date';

export function renderRegistrationLink(
	instance: Instance,
	event: Event
): { text: string; url: string } {
	const whatsappPhoneNumberId = instance.settings.communications.whatsapp.phone_number_id?.replace(
		'+',
		''
	);
	const text = `Hi! I'm interested in ${event.name} [SIGNUP:${event.id}] on ${formatDate(event.starts_at)}`;
	return {
		text: 'Whatsapp registration link',
		url: `https://wa.me/${whatsappPhoneNumberId}?text=${encodeURIComponent(text)}`
	};
}
