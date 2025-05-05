import { json, error, pino } from '$lib/server';
import { type TriggerEventMessage } from '$lib/schema/utils/email';
import { type Update as UpdateEventSchema } from '$lib/schema/events/events';
import {
	selectEventsForReminderFollowupEmail,
	setEventReminderFollowupEmailSent
} from '$lib/server/api/events/events';
import { unsafeListAllForEvent } from '$lib/server/api/events/attendees';
import * as m from '$lib/paraglide/messages';
const log = pino(import.meta.url);

export async function POST(event) {
	try {
		const { followups, reminders } = await selectEventsForReminderFollowupEmail();
		//followups
		await queueEmailsToAttendees({
			t: event.locals.t,
			eventObjects: followups,
			queue: event.locals.queue,
			type: 'followup'
		});
		//reminders
		await queueEmailsToAttendees({
			t: event.locals.t,
			eventObjects: reminders,
			queue: event.locals.queue,
			type: 'reminder'
		});
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/events/send_followup_email:01',
			m.teary_dizzy_earthworm_urge(),
			err
		);
	}
}

async function queueEmailsToAttendees({
	t,
	eventObjects,
	queue,
	type
}: {
	t: App.Localization;
	eventObjects: { id: number; instance_id: number; point_person_id: number }[];
	queue: App.Queue;
	type: 'reminder' | 'followup';
}) {
	for (let index = 0; index < eventObjects.length; index++) {
		const eventObject = eventObjects[index];
		const attendees = await unsafeListAllForEvent({
			instanceId: eventObject.instance_id,
			eventId: eventObject.id
		});
		for (let index = 0; index < attendees.length; index++) {
			const attendee = attendees[index];
			try {
				if (attendee.send_notifications && attendee.status === 'registered') {
					const sendToQueue: TriggerEventMessage = {
						person_id: attendee.person_id,
						event_id: eventObject.id
					};
					const urlForQueue = type === 'reminder' ? 'send_reminder_email' : 'send_followup_email';
					await queue(
						`utils/email/events/${urlForQueue}`,
						eventObject.instance_id,
						sendToQueue,
						eventObject.point_person_id
					);
				}
			} catch (err) {
				log.error(err, 'Error sending email to attendee');
				log.debug(
					{ attendee, eventId: eventObject.id, type, index },
					'Error sending email to attendee [details]'
				);
			}
		}
		await setEventReminderFollowupEmailSent({
			instanceId: eventObject.instance_id,
			eventId: eventObject.id,
			type
		});
	}
}
