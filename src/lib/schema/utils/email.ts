import { v, id, uuid } from '$lib/schema/valibot';
import { read as readEvent } from '$lib/schema/events/events';
import { read as readPerson } from '$lib/schema/people/people';
import { read as readInstance } from '$lib/schema/core/instance';
import {
	read as readMessage,
	emailTemplateNameEvent
} from '$lib/schema/communications/email/messages';
import { sendDetailForEmail } from '$lib/schema/communications/email/sent_emails';
export const sendEmailToListSchema = v.object({
	send_id: id,
	message_id: id
});
export type SendEmailToListSchema = v.InferOutput<typeof sendEmailToListSchema>;

export const sendEmailMessage = v.object({
	email: readMessage,
	person_id: id,
	email_message_id: id,
	sent_email_id: uuid,
	finish_send_id: v.optional(id)
});
export type SendEmailMessage = v.InferOutput<typeof sendEmailMessage>;

export const triggerEventMessage = v.object({
	event_id: id,
	person_id: id
});
export type TriggerEventMessage = v.InferOutput<typeof triggerEventMessage>;

export const triggerPetitionMessage = v.object({
	petition_id: id,
	person_id: id
});
export type TriggerPetitionMessage = v.InferOutput<typeof triggerPetitionMessage>;

export const sendEventEmailMessage = v.object({
	event: readEvent,
	person: readPerson,
	instance: readInstance,
	details: sendDetailForEmail,
	template: emailTemplateNameEvent
});
export type SendEventEmailMessage = v.InferOutput<typeof sendEventEmailMessage>;
