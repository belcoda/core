import { json, error } from '$lib/server';
import { eventNotification } from '$lib/schema/utils/notification.js';
import { parse } from '$lib/schema/valibot';
import { read as readEvent } from '$lib/server/api/events/events.js';
import { read as readPetition } from '$lib/server/api/petitions/petitions.js';
import { constructWhatsappNotification } from '$lib/server/api/communications/whatsapp/messages.js';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(eventNotification, body);
		let activity;
		let activityTitle = '';
		switch (parsed.event_type) {
			case 'event':
				activity = await readEvent({
					instanceId: event.locals.instance.id,
					eventId: parsed.activity_id,
					t: event.locals.t
				});
				activityTitle = activity.name;
				break;
			case 'petition':
				activity = await readPetition({
					instanceId: event.locals.instance.id,
					petitionId: parsed.activity_id,
					t: event.locals.t
				});
				activityTitle = activity.name;
				break;
			// TODO: Other activity types
			default:
				throw new Error('Invalid event type');
		}

		const message = constructWhatsappNotification({
			eventType: parsed.event_type,
			action: parsed.action,
			activityTitle,
			t: event.locals.t
		});
		// Send message
		await event.locals.queue(
			'/whatsapp/send_message',
			event.locals.instance.id,
			{ message, person_id: parsed.person_id },
			event.locals.admin.id
		);
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/communications/notifications:01',
			event.locals.t.errors.generic(),
			err
		);
	}
}
