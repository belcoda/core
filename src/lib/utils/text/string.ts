export function clampString(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}
	return str.slice(0, maxLength);
}

export function clampStringWithEllipsis(str: string, maxLength: number): string {
	return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}

import DOMPurify from 'isomorphic-dompurify';

/*
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
	return DOMPurify.sanitize(html);
}

export function addLineBreaks(str: string): string {
	return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

export function slugify(str: string) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = 'àáäâæǎãåāèéëêìíïîòóœøõōöôùúüûñç·/-,:;';
	var to = 'aaaaaaaaaeeeeiiiioooooooouuuunc______';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 _]/g, '') // remove invalid chars
		.replace(/\s+/g, '_') // collapse whitespace and replace by -
		.replace(/_+/g, '_'); // collapse dashes

	return str;
}

export function decodeHTMLEntities(text: string): string {
	const entities: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&nbsp;': ' '
	};

	return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity);
}

export function htmlToPlaintext(html: string): string {
	if (!html) return '';

	let text = html;

	// Convert <strong>/<b> to **text**
	text = text.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');

	// Convert <em>/<i> to _text_
	text = text.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '_$2_');

	// Convert <br> to line breaks
	text = text.replace(/<\s*br\s*\/?>/gi, '\n');

	// Convert <p> to double line breaks
	text = text.replace(/<\s*p[^>]*>/gi, '\n\n').replace(/<\s*\/p\s*>/gi, '');

	// Strip all other tags
	text = text.replace(/<[^>]+>/g, '');

	// Decode HTML entities
	text = decodeHTMLEntities(text);

	// Normalize spacing
	return text.replace(/\n{3,}/g, '\n\n').trim();
}
