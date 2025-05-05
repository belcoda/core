import { describe, it, expect, vi } from 'vitest';
import {
	extractTemplateMessageParams,
	interpolateTextParams,
	templateMessageParamsIndexes,
	extractComponents,
	countTextTemplatePlaceholders,
	extractTemplateMessageComponents,
	createMessageComponentsFromTemplateComponents,
	hasUnfilledPlaceholders
} from '$lib/comps/forms/whatsapp/messages/builder/actions/components';

// Sample test data
const sampleComponents = [
	{ type: 'header' as 'header', parameters: [{ type: 'text' as 'text', text: 'foo' }] },
	{
		type: 'body' as 'body',
		parameters: [{ type: 'text' as 'text', text: 'Hello {{1}}, your code is {{2}}' }]
	},
	{
		type: 'button' as 'button',
		sub_type: 'quick_reply' as 'quick_reply',
		index: 1,
		parameters: [{ type: 'payload' as 'payload', payload: 'uuid' }]
	}
];

describe('extractTemplateMessageParams', () => {
	it('should extract header, body, and buttons', () => {
		const result = extractTemplateMessageParams(sampleComponents);
		expect(result.header).toBeDefined();
		expect(result.body).toBeDefined();
		expect(result.buttons.length).toBe(1);
	});
});

describe('interpolateTextParams', () => {
	it('should replace placeholders with provided text', () => {
		const text = 'Hello {{1}}, your code is {{2}}';
		const params = [
			{ type: 'text' as 'text', text: 'John' },
			{ type: 'text' as 'text', text: '1234' }
		];
		const result = interpolateTextParams(text, params);
		expect(result).toBe('Hello John, your code is 1234');
	});
});

describe('templateMessageParamsIndexes', () => {
	it('should return correct indexes for components', () => {
		const result = templateMessageParamsIndexes(sampleComponents);
		expect(result.header).toBe(0);
		expect(result.body).toBe(1);
		expect(result.button).toEqual([2]);
	});
});

const templateComponentSampleButtons = [
	{ type: 'HEADER' as 'HEADER', format: 'TEXT' as 'TEXT', text: 'Hello, world' },
	{
		type: 'BODY' as 'BODY',
		format: 'TEXT' as 'TEXT',
		text: 'Hello {{1}}, your code is {{2}}'
	},
	{
		type: 'BUTTONS' as 'BUTTONS',
		buttons: [
			{
				type: 'PHONE_NUMBER' as 'PHONE_NUMBER',
				text: 'Call now',
				phone_number: '1234567890'
			},
			{
				type: 'QUICK_REPLY' as 'QUICK_REPLY',
				text: 'Reply'
			}
		]
	}
];

const templateComponentSampleFooter = [
	{
		type: 'BODY' as 'BODY',
		format: 'TEXT' as 'TEXT',
		text: 'Hello {{1}}, your code is {{2}}'
	},
	{
		type: 'FOOTER' as 'FOOTER',
		text: 'This is a footer'
	}
];

const templateComponentSampleImage = [
	{
		type: 'HEADER' as 'HEADER',
		format: 'IMAGE' as 'IMAGE',
		example: { header_handle: ['<meta-provided-id-using-resumable-upload-api>'] }
	},
	{
		type: 'BODY' as 'BODY',
		format: 'TEXT' as 'TEXT',
		text: 'Hello {{1}}, your code is {{2}}'
	},
	{
		type: 'BUTTONS' as 'BUTTONS',
		buttons: [
			{
				type: 'PHONE_NUMBER' as 'PHONE_NUMBER',
				text: 'foo',
				phone_number: '1234567890'
			}
		]
	}
];

describe('extractComponents', () => {
	it('should extract header, body, footer, and buttons', () => {
		const resultButtons = extractComponents(templateComponentSampleButtons);
		expect(resultButtons.header).toBeDefined();
		expect(resultButtons.body).toBeDefined();
		expect(resultButtons.footer).toBeUndefined();
		expect(resultButtons.buttons).toBeDefined();

		const resultFooter = extractComponents(templateComponentSampleFooter);
		expect(resultFooter.header).toBeUndefined();
		expect(resultFooter.body).toBeDefined();
		expect(resultFooter.footer).toBeDefined();
		expect(resultFooter.buttons).toBeUndefined();

		const resultImage = extractComponents(templateComponentSampleImage);
		expect(resultImage.header?.type).toBe('HEADER');
		expect(resultImage.header?.format).toBe('IMAGE');
		expect(resultImage.body).toBeDefined();
		expect(resultImage.footer).toBeUndefined();
		expect(resultImage.buttons).toBeDefined();
	});
});

describe('countTextTemplatePlaceholders', () => {
	it('should count the number of placeholders correctly', () => {
		expect(countTextTemplatePlaceholders('Hello {{1}}, your code is {{2}}')).toBe(2);
		expect(countTextTemplatePlaceholders('Hello {{1}}, your codes are {{2}} and {{3}}')).toBe(3);
		expect(countTextTemplatePlaceholders('Hello')).toBe(0);
		expect(countTextTemplatePlaceholders('Hello, {{name}}')).toBe(0);
		expect(countTextTemplatePlaceholders('Hello, {{1}}')).toBe(1);
	});
});

describe('extractTemplateMessageComponents', () => {
	it('should extract message components', () => {
		const result = extractTemplateMessageComponents(sampleComponents);
		expect(result.header).toBeDefined();
		expect(result.body).toBeDefined();
		expect(result.buttons.length).toBe(1);
	});
});

describe('createMessageComponentsFromTemplateComponents', () => {
	it('should extract components from a template message', () => {
		const actions = {};
		const threadMessage = {
			type: 'template' as 'template',
			template: {
				name: 'sample_template',
				language: { policy: 'deterministic' as 'deterministic', code: 'en' as 'en' },
				components: []
			}
		};
		const result = createMessageComponentsFromTemplateComponents(
			templateComponentSampleButtons,
			actions,
			threadMessage
		);

		expect(result.components.length).toBe(3); // header, body and buttons
		expect(result.components[0].type).toBe('header'); //header

		//body
		expect(result.components[1].type).toBe('body'); //body

		//buttons
		expect(Object.keys(result.actions).length).toBe(2); //two buttons
		expect(result.actions[Object.keys(result.actions)[0]]).toHaveLength(0);
		expect(result.actions[Object.keys(result.actions)[1]]).toHaveLength(0);
		//Index 1 is the quick reply button
		// @ts-expect-error - It doesn't know that parameter[0] is a quick reply type
		expect(Object.keys(result.actions)[1]).toBe(result.components[2].parameters[0].payload); //the payload of the quick reply button
	});

	it('should return an empty array for a non-template message type', () => {
		const actions = {};
		const threadMessage = {
			type: 'text' as 'text',
			body: {
				text: 'Hello, world',
				preview_url: true
			}
		};
		const result = createMessageComponentsFromTemplateComponents(
			templateComponentSampleButtons,
			actions,
			// @ts-expect-error - We're testing the function with a non-template message type
			threadMessage
		);
		expect(result.components.length).toBe(0);
	});
});

describe('hasUnfilledPlaceholders', () => {
	it('should return false when template is null', () => {
		expect(hasUnfilledPlaceholders(null, [], { type: 'template' })).toBe(false);
	});

	it('should return false when message is not template type', () => {
		expect(hasUnfilledPlaceholders({}, [], { type: 'text' })).toBe(false);
	});

	it('should return true when header has unfilled placeholders', () => {
		const template = {
			message: {
				components: [
					{
						type: 'HEADER',
						format: 'TEXT',
						text: 'Hello {{1}}'
					}
				]
			}
		};
		const components = [
			{
				type: 'header',
				parameters: []
			}
		];
		expect(hasUnfilledPlaceholders(template, components, { type: 'template' })).toBe(true);
	});

	it('should return true when body has unfilled placeholders', () => {
		const template = {
			message: {
				components: [
					{
						type: 'BODY',
						format: 'TEXT',
						text: 'Message {{1}}'
					}
				]
			}
		};
		const components = [
			{
				type: 'body',
				parameters: []
			}
		];
		expect(hasUnfilledPlaceholders(template, components, { type: 'template' })).toBe(true);
	});

	it('should return true when placeholder text still exists in parameters', () => {
		const template = {
			message: {
				components: [
					{
						type: 'BODY',
						format: 'TEXT',
						text: 'Message {{1}}'
					}
				]
			}
		};
		const components = [
			{
				type: 'body',
				parameters: [
					{
						type: 'text',
						text: '{{1}}'
					}
				]
			}
		];
		expect(hasUnfilledPlaceholders(template, components, { type: 'template' })).toBe(true);
	});

	it('should return false when all placeholders are filled', () => {
		const template = {
			message: {
				components: [
					{
						type: 'HEADER',
						format: 'TEXT',
						text: 'Hello {{1}}'
					},
					{
						type: 'BODY',
						format: 'TEXT',
						text: 'Message {{1}} and {{2}}'
					}
				]
			}
		};
		const components = [
			{
				type: 'header',
				parameters: [
					{
						type: 'text',
						text: 'John'
					}
				]
			},
			{
				type: 'body',
				parameters: [
					{
						type: 'text',
						text: 'John'
					},
					{
						type: 'text',
						text: 'Doe'
					}
				]
			}
		];
		expect(hasUnfilledPlaceholders(template, components, { type: 'template' })).toBe(false);
	});
});
