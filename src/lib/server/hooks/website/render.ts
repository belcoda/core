import {
	v,
	customCode as customCodeSchema,
	parse,
	htmlMetatags,
	type CustomCode,
	type HtmlMetatags
} from '$lib/schema/valibot';
import type { Read as ReadContent } from '$lib/schema/website/content';
import type { Read as ReadEvent } from '$lib/schema/events/events';
import type { Read as ReadPetition } from '$lib/schema/petitions/petitions';
import type { Read as ReadInstance } from '$lib/schema/core/instance';

import { pino } from '$lib/server';
const log = pino(import.meta.url);

export function compile_custom_code(content: unknown, template: unknown) {
	const customCode = parse(customCodeSchema, content);
	const customTemplate = parse(customCodeSchema, template);
	const custom_css = `${customCode.custom_css || ''} ${customTemplate.custom_css || ''}`;
	const custom_jss = `${customCode.custom_js || ''} ${customTemplate.custom_js || ''}`;
	return {
		custom_css: custom_css.length > 0 ? custom_css : null,
		custom_js: custom_jss.length > 0 ? custom_jss : null,
		custom_html_head: `${customCode.custom_html_head || ''} ${customTemplate.custom_html_head || ''}`,
		custom_html_body: `${customCode.custom_html_body || ''} ${customTemplate.custom_html_body || ''}`
	};
}
export type RenderStatus = { success: boolean; error: string | null };
export type RenderContext =
	| { content: ReadContent; status: RenderStatus; instance: ReadInstance }
	| { event: ReadEvent; status: RenderStatus; instance: ReadInstance }
	| { petition: ReadPetition; status: RenderStatus; instance: ReadInstance };

export function render({
	context,
	renderedContent,
	customCode,
	metatags
}: {
	context: RenderContext;
	renderedContent: string;
	customCode: CustomCode;
	metatags: HtmlMetatags;
}): string {
	try {
		const parsedCustomCode = parse(customCodeSchema, customCode);
		const parsedMetatags = parse(htmlMetatags, metatags);
		return `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">

				${generate_html_head(parsedMetatags)}
				${parsedCustomCode.custom_html_head}
				${parsedCustomCode.custom_css ? `<style>${parsedCustomCode.custom_css}</style>` : ''}
				<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
				<link rel="icon" href="${context.instance.settings.website.favicon}" />
			</head>
			<body>
				${renderedContent}
				${parsedCustomCode.custom_js ? `<script>${parsedCustomCode.custom_js}</script>` : ''}
				${parsedCustomCode.custom_html_body}
			</body>
		</html>
			`;
	} catch (error) {
		log.debug({ error }, 'Error rendering HTML');
		throw {
			title: 'Unknown error',
			error_code: 'Error 500',
			error_message: 'An unknown error occurred while rendering the page'
		};
	}
}

function generate_html_head(raw_content: unknown) {
	const content = parse(htmlMetatags, raw_content);

	const merged = {
		title: content.title,
		description: content.description,
		subject: content.subject,
		keywords: content.keywords,
		openGraph: {
			title: content.openGraph.title,
			description: content.openGraph.description,
			image: content.openGraph.image,
			image_alt: content.openGraph.image_alt
		},
		twitter: {
			card: content.twitter.card,
			title: content.twitter.title,
			description: content.twitter.description,
			image: content.twitter.image,
			image_alt: content.twitter.image_alt
		}
	};

	return `<title>${merged.title || 'Untitled'}</title>
${merged.description ? `<meta name="description" content="${merged.description}">` : ''}
${merged.subject ? `<meta name="subject" content="${merged.subject}">` : ''}
${merged.keywords ? `<meta name="keywords" content="${merged.keywords}">` : ''}
<meta property="og:type" content="website">
${merged.openGraph.title ? `<meta property="og:title" content="${merged.openGraph.title}">` : ''}
${merged.openGraph.description ? `<meta property="og:description" content="${merged.openGraph.description}">` : ''}
${merged.openGraph.image ? `<meta property="og:image" content="${merged.openGraph.image}">` : ''}
${merged.openGraph.image_alt ? `<meta property="og:image:alt" content="${merged.openGraph.image_alt}">` : ''}
${merged.twitter.card ? `<meta name="twitter:card" content="${merged.twitter.card}">` : ''}
${merged.twitter.title ? `<meta name="twitter:title" content="${merged.twitter.title}">` : ''}
${merged.twitter.description ? `<meta name="twitter:description" content="${merged.twitter.description}">` : ''}
${merged.twitter.image ? `<meta name="twitter:image" content="${merged.twitter.image}">` : ''}
${merged.twitter.image_alt ? `<meta name="twitter:image:alt" content="${merged.twitter.image_alt}">` : ''}
`;
}
