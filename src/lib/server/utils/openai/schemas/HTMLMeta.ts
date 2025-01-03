import { parse, htmlMetatags, type HtmlMetatags } from '$lib/schema/valibot';

//export const jsonSchemaHtmlMetatags = toJsonSchema(htmlMetatags); // { type: 'string', format: 'email' }
import { jsonCompletion } from '$lib/server/utils/openai/index';
export const SYSTEM_PROMPT: string = `You are responsible for generating the HTML metadata tags for a web page based on the <H1> title and the HTML content of the web page. You need to generate content which is concise and engaging, but you don't want to verge into clickbaity titles or poor taste. Certain types of pages might be events, petitions or other pages that encourage the visitor to take action. If so, you can include words of that call to action in the text you generate, so long as it is coherent engaging copy and makes sense in context. 

For some specific ranges, openGraph titles should aim to be 40 characters, although up to 60 is acceptable if under 40 is hard (more than 40 will be cut off for many mobile viewers).  Twitter titles should be around 60 characters. Descriptions should be a maximum of 2 punchy sentences. Don't include hashtags in descriptions. 

If the page topic is political or sensitive, you can follow accordingly, but please do so with care. Do not write anything offensive or problematic, and definitely don't use any curse words or strong language! Please match the language of the content (ie: if the web page is in French, the metatag content you generate should accordingly be in French too)`;

// JSON Schema for HTML Metatags. Currently OpenAI supports a limited subset of Json schema 7 so we can't generate it from the Valibot types. I'm sure this will happen in time.
export const JSON_SCHEMA_HTML_METATAGS = {
	name: 'htmlMetatags',
	strict: true,
	schema: {
		properties: {
			title: {
				type: ['string', 'null']
			},
			description: {
				type: ['string', 'null']
			},
			subject: {
				type: ['string', 'null']
			},
			keywords: {
				type: ['string', 'null']
			},
			openGraph: {
				type: 'object',
				properties: {
					title: {
						type: ['string', 'null']
					},
					description: {
						type: ['string', 'null']
					}
				},
				required: ['description', 'title'],
				additionalProperties: false
			},
			twitter: {
				type: 'object',
				properties: {
					title: {
						type: ['string', 'null']
					},
					description: {
						type: ['string', 'null']
					}
				},
				required: ['title', 'description'],
				additionalProperties: false
			}
		},
		additionalProperties: false,
		required: ['title', 'description', 'subject', 'keywords', 'openGraph', 'twitter'],
		type: 'object'
	}
};

export async function generateHtmlMetatags(
	pageTitle: string,
	pageContent: string
): Promise<HtmlMetatags> {
	const prompt = `TITLE: ${pageTitle} 
CONTENT: 
${pageContent}`;
	const result = await jsonCompletion(SYSTEM_PROMPT, prompt, JSON_SCHEMA_HTML_METATAGS);
	const parsed = parse(htmlMetatags, result.parsed);
	return parsed;
}
