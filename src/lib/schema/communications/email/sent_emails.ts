import { v, id, timestamp, uuid, emailMessage } from '$lib/schema/valibot';

export const sendDetailOptions = {
	eventReminder: v.object({
		type: v.literal('event_reminder'),
		event_id: id
	}),
	eventRegistration: v.object({
		type: v.literal('event_registration'),
		event_id: id
	}),
	eventCancellation: v.object({
		type: v.literal('event_cancellation'),
		event_id: id
	}),
	eventFollowUp: v.object({
		type: v.literal('event_follow_up'),
		event_id: id,
		message_id: id
	}),
	eventChangedNotification: v.object({
		type: v.literal('event_changed_notification'),
		event_id: id
	}),
	eventCancelledNotification: v.object({
		type: v.literal('event_cancelled_notification'),
		event_id: id
	}),
	petitionSignature: v.object({
		type: v.literal('petition_signature'),
		petition_id: id
	}),
	adminInvitation: v.object({
		type: v.literal('admin_invitation'),
		email: emailMessage
	}),
	sendToList: v.object({
		type: v.literal('send_to_list')
	})
};

export const sendDetail = v.variant('type', [
	sendDetailOptions.eventReminder,
	sendDetailOptions.eventRegistration,
	sendDetailOptions.eventCancellation,
	sendDetailOptions.eventFollowUp,
	sendDetailOptions.eventChangedNotification,
	sendDetailOptions.eventCancelledNotification,
	sendDetailOptions.petitionSignature,
	sendDetailOptions.adminInvitation,
	sendDetailOptions.sendToList
]);
export type SendDetail = v.InferOutput<typeof sendDetail>;

export const sendDetailForEmail = v.variant('type', [
	sendDetailOptions.eventReminder,
	sendDetailOptions.eventRegistration,
	sendDetailOptions.eventCancellation,
	sendDetailOptions.eventFollowUp,
	sendDetailOptions.eventChangedNotification,
	sendDetailOptions.eventCancelledNotification
]);
export type SendDetailForEmail = v.InferOutput<typeof sendDetailForEmail>;

export const base = v.object({
	id: uuid,
	send_id: v.nullable(id),
	person_id: id,
	details: v.nullable(sendDetail),
	sent_at: timestamp
});

export const read = base;
export type Read = v.InferOutput<typeof read>;

export const list = v.array(read);
export type List = v.InferOutput<typeof list>;

export const create = v.omit(base, ['sent_at', 'id']);
export type Create = v.InferOutput<typeof create>;
