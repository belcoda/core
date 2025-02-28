import { id, v } from '../valibot';

export const eventNotification = v.object({
	activity_id: id,
	person_id: id,
	event_type: v.picklist(['event', 'petition']),
	action: v.picklist(['register', 'cancel', 'reminder'])
});
