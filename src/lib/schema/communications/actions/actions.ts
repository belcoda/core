import { v, id, uuid, mediumString } from '$lib/schema/valibot';
import { maxLength } from 'valibot';

export const keyword_triggers = v.record(v.pipe(v.string(), maxLength(20)), uuid);
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

export const actions = v.record(
	uuid,
	v.array(
		v.variant('type', [
			trigger_function,
			register_for_event,
			sign_petition,
			send_whatsapp_message,
			send_email,
			send_sms
		])
	)
);

export type Actions = v.InferOutput<typeof actions>;
