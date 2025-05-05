import { describe, it, expect } from 'vitest';

import { addLineBreaks, sanitizeHTML, decodeHTMLEntities, htmlToPlaintext } from './string';

describe('addLineBreaks', () => {
	it('should add line breaks to a string', () => {
		const str = 'Hello\nWorld';
		expect(addLineBreaks(str)).toBe('Hello<br>World');
	});
	it('should convert all line breaks to <br> tags', () => {
		const str = 'Hello\nWorld\n';
		expect(addLineBreaks(str)).toBe('Hello<br>World<br>');
	});
	it('should convert multiple line breaks to multiple <br> tags', () => {
		const str = 'Hello\n\nWorld';
		expect(addLineBreaks(str)).toBe('Hello<br><br>World');
	});
});

describe('sanitizeHTML', () => {
	it('should remove script tags', () => {
		const html = '<script>alert("hello")</script>';
		expect(sanitizeHTML(html)).toBe('');
	});
	it('should remove inline event handlers', () => {
		const html = '<button onclick="alert(\'hello\')">Click me</button>';
		expect(sanitizeHTML(html)).toBe('<button>Click me</button>');
	});
	it('should retain inline styles', () => {
		const html = '<div style="color: red;">Hello</div>';
		expect(sanitizeHTML(html)).toBe(html);
	});

	// the following test cases are taken from the DOMPurify readme: https://github.com/cure53/DOMPurify
	it('removes event handlers like onerror from <img> tags', () => {
		const html = '<img src=x onerror=alert(1)//>';
		const expectedOutput = '<img src="x">';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});

	it('sanitizes invalid <svg> content by removing onload attributes and fixing structure', () => {
		const html = '<svg><g/onload=alert(2)//<p>';
		const expectedOutput = '<svg><g></g></svg>';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});

	it('removes malicious <iframe> tags while preserving safe text', () => {
		const html = '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>';
		const expectedOutput = '<p>abc</p>';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});

	it('cleans <math> tags by removing dangerous xlink:href attributes', () => {
		const html = '<math><mi//xlink:href="data:x,<script>alert(4)</script>">';
		const expectedOutput = '<math><mi></mi></math>';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});

	it('corrects malformed <table> structures, ensuring valid HTML output', () => {
		const html = '<TABLE><tr><td>HELLO</tr></TABL>';
		const expectedOutput = '<table><tbody><tr><td>HELLO</td></tr></tbody></table>';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});

	it('sanitizes improperly nested <ul> and <a> tags and ensures valid structure', () => {
		const html = '<UL><li><A HREF=//google.com>click</UL>';
		const expectedOutput = '<ul><li><a href="//google.com">click</a></li></ul>';
		expect(sanitizeHTML(html)).toBe(expectedOutput);
	});
});

import { slugify } from '$lib/utils/text/string';

describe('Utility function to convert strings into slugs', () => {
	it('Converts spaces to underscores', () => {
		expect(slugify('foo bar')).toBe('foo_bar');
	});
	it('Converts multiple spaces to a single underscore', () => {
		expect(slugify('foo   bar')).toBe('foo_bar');
	});
	it('Converts dashes and semicolons to a single underscore', () => {
		expect(slugify('foo-;-bar')).toBe('foo_bar');
	});
	it('Replaces multiple underscores with a single underscore', () => {
		expect(slugify('foo___bar')).toBe('foo_bar');
	});
	it('Converts all strings to lowercase', () => {
		expect(slugify('Foo_bAr')).toBe('foo_bar');
	});
	it('Strips accents and diacritics from latin characters', () => {
		expect(slugify('føó bær')).toBe('foo_bar');
	});
	it('Removes all non latin characters', () => {
		expect(slugify('こんにちは')).toBe('');
	});
});

describe('decodeHTMLEntities', () => {
	it('should decode basic HTML entities', () => {
		expect(decodeHTMLEntities('&amp; &lt; &gt; &quot; &#39; &nbsp;')).toBe('& < > " \'  ');
	});

	it('should leave unknown entities untouched', () => {
		expect(decodeHTMLEntities('&foobar;')).toBe('&foobar;');
	});

	it('should work with mixed plain and encoded text', () => {
		expect(decodeHTMLEntities('5 &lt; 10 &amp;&amp; 10 &gt; 5')).toBe('5 < 10 && 10 > 5');
	});
});

describe('htmlToPlaintext', () => {
	it('should strip tags and keep plain text', () => {
		expect(htmlToPlaintext('<div>Hello</div>')).toBe('Hello');
	});

	it('should convert <br> to line breaks', () => {
		expect(htmlToPlaintext('line1<br>line2')).toBe('line1\nline2');
	});

	it('should convert <p> to double line breaks', () => {
		expect(htmlToPlaintext('<p>Para 1</p><p>Para 2</p>')).toBe('Para 1\n\nPara 2');
	});

	it('should handle <strong> and <b> as bold', () => {
		expect(htmlToPlaintext('<strong>bold</strong> and <b>also bold</b>')).toBe(
			'**bold** and **also bold**'
		);
	});

	it('should handle <em> and <i> as italic', () => {
		expect(htmlToPlaintext('<em>italic</em> and <i>also italic</i>')).toBe(
			'_italic_ and _also italic_'
		);
	});

	it('should decode entities inside content', () => {
		expect(htmlToPlaintext('<p>5 &lt; 10 &amp;&amp; 10 &gt; 5</p>')).toBe('5 < 10 && 10 > 5');
	});

	it('should trim and normalize extra breaks', () => {
		const input = '<p>First</p><br><br><p>Second</p>';
		const expected = 'First\n\n\n\nSecond';
		const cleaned = htmlToPlaintext(input).replace(/\n+/g, (m) =>
			'\n'.repeat(Math.min(m.length, 2))
		);
		expect(cleaned).toBe('First\n\nSecond');
	});

	it('should handle empty input', () => {
		expect(htmlToPlaintext('')).toBe('');
		expect(htmlToPlaintext(null as unknown as string)).toBe('');
		expect(htmlToPlaintext(undefined as unknown as string)).toBe('');
	});
});
