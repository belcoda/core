import { sendDetail } from '$lib/schema/communications/email/sent_emails';
import {
	v,
	count,
	id,
	timestamp,
	email,
	longString,
	shortString,
	mediumString,
	shortStringNotEmpty,
	emailAttachments,
	jsonSchemaObject
} from '$lib/schema/valibot';

export const emailTemplates = [
	'main',
	'main-nologo',
	'minimal',
	'transactional',
	'event-reminder-registration'
] as const;
export const emailTemplateName = v.picklist(emailTemplates);
export type EmailTemplateName = v.InferOutput<typeof emailTemplateName>;
export const emailTemplateNameEvent = v.picklist(['event-reminder-registration']);
export type EmailTemplateNameEvent = v.InferOutput<typeof emailTemplateNameEvent>;

export const base = v.object({
	id: id,
	instance_id: id,
	template_name: emailTemplateName,
	name: shortString,
	from: mediumString,
	from_signature_id: v.nullable(id),
	reply_to: mediumString,
	subject: mediumString,
	preview_text: longString,
	html: longString,
	text: longString,
	point_person_id: id,
	use_html_for_plaintext: v.boolean(),
	created_at: timestamp,
	updated_at: timestamp
});

export const read = v.omit(base, ['instance_id']);
export type Read = v.InferOutput<typeof read>;

export const list = v.object({
	count: count,
	items: v.array(v.omit(base, ['instance_id', 'html', 'text']))
});
export type List = v.InferOutput<typeof list>;

export const create = v.object({
	name: base.entries.name,
	from: base.entries.from,
	from_signature_id: v.optional(base.entries.from_signature_id, null),
	template_name: v.optional(base.entries.template_name, 'main'),
	reply_to: base.entries.reply_to,
	subject: base.entries.subject,
	preview_text: v.optional(base.entries.preview_text, ''),
	html: base.entries.html,
	text: base.entries.text,
	point_person_id: base.entries.point_person_id,
	use_html_for_plaintext: v.optional(base.entries.use_html_for_plaintext, true)
});
export type Create = v.InferOutput<typeof create>;
export type CreateInput = v.InferInput<typeof create>;

export const update = v.partial(create);
export type Update = v.InferOutput<typeof update>;

export const sendTestEmail = v.object({
	email: email,
	message: read,
	context: v.object({
		person_id: v.optional(v.nullable(id))
	})
});
export type SendTestEmail = v.InferOutput<typeof sendTestEmail>;

export const emailTemplateMessage = v.object({
	person_id: id,
	send_id: v.optional(id),
	template: emailTemplateName,
	context: jsonSchemaObject,
	from_signature_id: v.optional(id),
	send_details: sendDetail,
	reply_to: v.optional(v.nullable(email), null),
	attachments: v.optional(v.array(emailAttachments))
});
export type EmailTemplateMessage = v.InferOutput<typeof emailTemplateMessage>;
