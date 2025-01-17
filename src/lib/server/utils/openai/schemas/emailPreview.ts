import { parse } from '$lib/schema/valibot';
import { type EmailPreview, emailPreview } from '$lib/schema/utils/openai';

import { jsonCompletion } from '$lib/server/utils/openai/index';
export const SYSTEM_PROMPT: string = `You are responsible for generating the email preview text for an email. 

Preview text is the bit of text below or next to an email’s subject line in the inbox that gives extra insight into what’s inside the email. Gmail refers to this as "snippets", Apple Mail refers to it as a "preview", and Outlook calls it a "Message Preview". Its purpose is to summarise the email content in an engaging manner that is likely to make the recipient want to open and read the email (but don't go for clickbait!). It should be approximately 90 characters long, and certainly no more than 210 characters.

It must reflect the email's subject and body content. The body content will be presented in email HTML format, so it may be somewhat difficult to parse. Ignore the many table tags, and focus on the text content (but do pay attention to H1 and other tags that might denote information heirarchy). Keep in mind that it will be displayed next to the subject line, so try to make sure it makes sense and matches that thematically and in terms of content (without simply repeating or restating the subject line).

If the email topic is political or sensitive, you can follow accordingly, but please do so with care. Do not write anything offensive or problematic, and definitely don't use any curse words or strong language! Please match the language of the content (ie: if the web page is in French, the metatag content you generate should accordingly be in French too)`;

// JSON Schema for generating email previews. Currently OpenAI supports a limited subset of Json schema 7 so we can't generate it from the Valibot types. I'm sure this will happen in time.
export const JSON_SCHEMA_EMAIL_PREVIEW = {
	name: 'emailPreview',
	strict: true,
	schema: {
		properties: {
			preview: {
				type: ['string']
			}
		},
		additionalProperties: false,
		required: ['preview'],
		type: 'object'
	}
};

export async function generateEmailPreview(
	subject: string,
	messsageHTML: string
): Promise<EmailPreview> {
	const prompt = `Subject: ${subject} 
Body (email HTML): 
${messsageHTML}`;
	const result = await jsonCompletion(SYSTEM_PROMPT, prompt, JSON_SCHEMA_EMAIL_PREVIEW);
	const parsed = parse(emailPreview, result.parsed);
	return parsed;
}
