import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
export async function jsonCompletion(systemPrompt: string, userPrompt: string, schema: any) {
	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: userPrompt
			}
		],
		response_format: { type: 'json_schema', json_schema: schema }
	});
	return completion.choices[0].message;
}
