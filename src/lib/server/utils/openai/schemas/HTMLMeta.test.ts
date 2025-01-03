import {
	generateHtmlMetatags,
	JSON_SCHEMA_HTML_METATAGS,
	SYSTEM_PROMPT
} from '$lib/server/utils/openai/schemas/HTMLMeta';
import { jsonCompletion } from '$lib/server/utils/openai';
import { expect, describe, afterAll, it, vi } from 'vitest';
import { htmlMetatags } from '$lib/schema/valibot';

const JSONschema = Object.keys(JSON_SCHEMA_HTML_METATAGS.schema.properties);
const valibotSchema = Object.keys(htmlMetatags.entries);
const extraKey = 'isManuallySet'; //valibotSchema has an extra key which isn't set by the OpenAI API

//object types
const JSONSchemaOpenGraph = JSON_SCHEMA_HTML_METATAGS.schema.properties.openGraph.properties;
const valibotSchemaOpenGraph = htmlMetatags.entries.openGraph.entries;

const JSONSchemaTwitter = JSON_SCHEMA_HTML_METATAGS.schema.properties.twitter.properties;
const valibotSchemaTwitter = htmlMetatags.entries.twitter.entries;

describe('JSONSchema definition for OpenAI html Metatag generation', () => {
	it('Matches the valibot schema for the base HTML metatag object', async () => {
		expect(valibotSchema).toContain(extraKey);
		expect(JSONschema).not.toContain(extraKey);
		expect(valibotSchema).toEqual(expect.arrayContaining(JSONschema));
	});
	it('Matches the valibot schema for OpenGraph', async () => {
		const JSONSchemaOpenGraphKeys = Object.keys(JSONSchemaOpenGraph);
		const valibotSchemaOpenGraphKeys = Object.keys(valibotSchemaOpenGraph);
		expect(valibotSchemaOpenGraphKeys).toEqual(expect.arrayContaining(JSONSchemaOpenGraphKeys));
	});

	it('Matches the valibot schema for Twitter', async () => {
		const JSONSchemaTwitterKeys = Object.keys(JSONSchemaTwitter);
		const valibotSchemaTwitterKeys = Object.keys(valibotSchemaTwitter);
		expect(valibotSchemaTwitterKeys).toEqual(expect.arrayContaining(JSONSchemaTwitterKeys));
	});
});

describe('OpenAI html Metatag generation', async () => {
	vi.mock('$lib/server/utils/openai', () => ({
		jsonCompletion: vi.fn().mockResolvedValue({
			parsed: {
				// Dummy values based on a petition found online
				title: 'Public Money for Public Good, Not Gas',
				subject: 'Redirect public funding for the Middle Arm gas hub',
				twitter: {
					card: 'summary',
					image: null,
					title: 'Public Money for Public Good, Not Gas',
					image_alt: null,
					description:
						'Stand up for NT communities! Demand Treasurer Chalmers redirect $1.9 billion from gas funding today.'
				},
				keywords:
					'Treasurer, public funding, Middle Arm gas hub, renewable energy, Northern Territory, email Jim Chalmers, gas lobbyists',
				openGraph: {
					image: null,
					title: 'Public Money for Public Good, Not Gas',
					image_alt: null,
					description:
						'Support a movement to redirect $1.9 billion in public funds from gas initiatives to community projects!'
				},
				description:
					'Join the call to redirect $1.9 billion in public funds from the Middle Arm gas hub to support Northern Territory communities! Email Treasurer Chalmers and make your voice heard.',
				isManuallySet: false
			}
		})
	}));

	afterAll(() => {
		// Reset all mocks after each test
		vi.resetAllMocks();
	});

	const pageTitle = 'Test title';
	const pageContent = 'Test description';
	const result = await generateHtmlMetatags(pageTitle, pageContent); //function is mocked so input doesn't matter
	it('Generates the expected html metatags', async () => {
		expect(result.title).toEqual('Public Money for Public Good, Not Gas');
	});

	it('Calls the OpenAI API with the correct prompt', async () => {
		expect(jsonCompletion).toHaveBeenCalledOnce();
		expect(jsonCompletion).toHaveBeenCalledWith(
			SYSTEM_PROMPT,
			`TITLE: ${pageTitle} 
CONTENT: 
${pageContent}`,
			JSON_SCHEMA_HTML_METATAGS
		);
	});
});
