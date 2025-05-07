import { id, uuid, mediumString, v } from '$lib/schema/valibot';

export const keyword_triggers = v.record(v.pipe(v.string(), v.maxLength(20)), uuid);
export type KeywordTriggers = v.InferOutput<typeof keyword_triggers>;

export const trigger_function = v.object({
	type: v.literal('trigger_function'),
	function_id: id,
	data: mediumString
});

export const register_for_event = v.object({
	type: v.literal('register_for_event'),
	event_id: id
});

export const sign_petition = v.object({
	type: v.literal('sign_petition'),
	petition_id: id
});

export const send_whatsapp_message = v.object({
	type: v.literal('send_whatsapp_message'),
	message_id: uuid
});

export const send_email = v.object({
	type: v.literal('send_email'),
	email_id: id
});

export const send_sms = v.object({
	type: v.literal('send_sms'),
	sms_id: id
});

export const actionArray = v.array(
	v.variant('type', [
		trigger_function,
		register_for_event,
		sign_petition,
		send_whatsapp_message,
		send_email,
		send_sms
	])
);
export type ActionArray = v.InferOutput<typeof actionArray>;

export const actions = v.record(uuid, actionArray);

export type Actions = v.InferOutput<typeof actions>;

export const actionTriggerType = v.picklist(['whatsapp_message']);

export const triggerAction = v.object({
	type: actionTriggerType,
	person_id: id,
	action_id: uuid,
	data: v.optional(v.record(v.string(), v.any())) // Specify object with any string keys and values
});
