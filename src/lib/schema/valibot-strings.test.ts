import { parse } from '$lib/schema/valibot';
import { describe, expect, it } from 'vitest';

import { shortString } from '$lib/schema/valibot';
import { SHORT_STRING_MAX_LENGTH } from '$lib/schema/valibot';
describe('shortString', () => {
	it('should parse a short string', () => {
		expect(parse(shortString, 'hello')).toBe('hello');
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(shortString, 'a'.repeat(101))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(shortString, 123)).toThrow();
	});
	it('should throw an error if the input is null', () => {
		expect(() => parse(shortString, null)).toThrow();
	});
	it('should parse even if the string is empty', () => {
		expect(parse(shortString, '')).toBe('');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(SHORT_STRING_MAX_LENGTH);
		expect(parse(shortString, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(shortString, 'a'.repeat(SHORT_STRING_MAX_LENGTH + 1))).toThrow();
	});
});

import { shortStringNotEmpty } from '$lib/schema/valibot';
describe('shortStringNotEmpty', () => {
	it('should parse a short string', () => {
		expect(parse(shortStringNotEmpty, 'hello')).toBe('hello');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(SHORT_STRING_MAX_LENGTH);
		expect(parse(shortStringNotEmpty, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(shortStringNotEmpty, 'a'.repeat(SHORT_STRING_MAX_LENGTH + 1))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(shortStringNotEmpty, undefined)).toThrow();
		expect(() => parse(shortStringNotEmpty, new Date())).toThrow();
		expect(() => parse(shortStringNotEmpty, null)).toThrow();
		expect(() => parse(shortStringNotEmpty, 123)).toThrow();
		expect(() => parse(shortStringNotEmpty, new Error())).toThrow();
		expect(() => parse(shortStringNotEmpty, true)).toThrow();
		expect(() => parse(shortStringNotEmpty, new Promise((resolve, reject) => {}))).toThrow();
		expect(() => parse(shortStringNotEmpty, [])).toThrow();
		expect(() => parse(shortStringNotEmpty, {})).toThrow();
	});
	it('should throw an error if the input is empty', () => {
		expect(() => parse(shortStringNotEmpty, '')).toThrow();
	});
});

import { mediumString } from '$lib/schema/valibot';
import { MEDIUM_STRING_MAX_LENGTH } from '$lib/schema/valibot';

describe('mediumString', () => {
	it('should parse a medium string', () => {
		expect(parse(mediumString, 'hello')).toBe('hello');
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(mediumString, 'a'.repeat(1001))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(mediumString, 123)).toThrow();
	});
	it('should throw an error if the input is null', () => {
		expect(() => parse(mediumString, null)).toThrow();
	});
	it('should parse even if the string is empty', () => {
		expect(parse(mediumString, '')).toBe('');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(MEDIUM_STRING_MAX_LENGTH);
		expect(parse(mediumString, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(mediumString, 'a'.repeat(MEDIUM_STRING_MAX_LENGTH + 1))).toThrow();
	});
});

import { mediumStringNotEmpty } from '$lib/schema/valibot';
describe('mediumStringNotEmpty', () => {
	it('should parse a medium string', () => {
		expect(parse(mediumStringNotEmpty, 'hello')).toBe('hello');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(MEDIUM_STRING_MAX_LENGTH);
		expect(parse(mediumStringNotEmpty, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(mediumStringNotEmpty, 'a'.repeat(MEDIUM_STRING_MAX_LENGTH + 1))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(mediumStringNotEmpty, undefined)).toThrow();
		expect(() => parse(mediumStringNotEmpty, new Date())).toThrow();
		expect(() => parse(mediumStringNotEmpty, null)).toThrow();
		expect(() => parse(mediumStringNotEmpty, 123)).toThrow();
		expect(() => parse(mediumStringNotEmpty, new Error())).toThrow();
		expect(() => parse(mediumStringNotEmpty, true)).toThrow();
		expect(() => parse(mediumStringNotEmpty, new Promise((resolve, reject) => {}))).toThrow();
		expect(() => parse(mediumStringNotEmpty, [])).toThrow();
		expect(() => parse(mediumStringNotEmpty, {})).toThrow();
	});
	it('should throw an error if the input is empty', () => {
		expect(() => parse(mediumStringNotEmpty, '')).toThrow();
	});
});

import { longString } from '$lib/schema/valibot';
import { LONG_STRING_MAX_LENGTH } from '$lib/schema/valibot';

describe('longString', () => {
	it('should parse a long string', () => {
		expect(parse(longString, 'hello')).toBe('hello');
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(longString, 'a'.repeat(100001))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(longString, 123)).toThrow();
	});
	it('should throw an error if the input is null', () => {
		expect(() => parse(longString, null)).toThrow();
	});
	it('should parse even if the string is empty', () => {
		expect(parse(longString, '')).toBe('');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(LONG_STRING_MAX_LENGTH);
		expect(parse(longString, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(longString, 'a'.repeat(LONG_STRING_MAX_LENGTH + 1))).toThrow();
	});
});

import { longStringNotEmpty } from '$lib/schema/valibot';
describe('longStringNotEmpty', () => {
	it('should parse a long string', () => {
		expect(parse(longStringNotEmpty, 'hello')).toBe('hello');
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(LONG_STRING_MAX_LENGTH);
		expect(parse(longStringNotEmpty, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(longStringNotEmpty, 'a'.repeat(LONG_STRING_MAX_LENGTH + 1))).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(longStringNotEmpty, undefined)).toThrow();
		expect(() => parse(longStringNotEmpty, new Date())).toThrow();
		expect(() => parse(longStringNotEmpty, null)).toThrow();
		expect(() => parse(longStringNotEmpty, 123)).toThrow();
		expect(() => parse(longStringNotEmpty, new Error())).toThrow();
		expect(() => parse(longStringNotEmpty, true)).toThrow();
		expect(() => parse(longStringNotEmpty, new Promise((resolve, reject) => {}))).toThrow();
		expect(() => parse(longStringNotEmpty, [])).toThrow();
		expect(() => parse(longStringNotEmpty, {})).toThrow();
	});
	it('should throw an error if the input is empty', () => {
		expect(() => parse(longStringNotEmpty, '')).toThrow();
	});
});

import { slug } from '$lib/schema/valibot';
import { slugify } from '$lib/utils/text/string';
describe('slug', () => {
	it('should parse a slug', () => {
		expect(parse(slug, 'hello')).toBe('hello');
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(slug, 123)).toThrow();
		expect(() => parse(slug, undefined)).toThrow();
		expect(() => parse(slug, new Date())).toThrow();
		expect(() => parse(slug, null)).toThrow();
		expect(() => parse(slug, true)).toThrow();
		expect(() => parse(slug, new Error())).toThrow();
		expect(() => parse(slug, new Promise((resolve, reject) => {}))).toThrow();
		expect(() => parse(slug, [])).toThrow();
		expect(() => parse(slug, {})).toThrow();
	});
	it('should throw an error if the input is null', () => {
		expect(() => parse(slug, null)).toThrow();
	});
	it('should throw an error if the input string is empty', () => {
		expect(() => parse(slug, '')).toThrow();
	});
	it('should throw an error if the input is too long', () => {
		expect(() => parse(slug, 'a'.repeat(SHORT_STRING_MAX_LENGTH + 1))).toThrow();
	});
	it('should parse a string that is the max length', () => {
		const generatedString = 'a'.repeat(SHORT_STRING_MAX_LENGTH);
		expect(parse(slug, generatedString)).toBe(generatedString);
	});
	it('should throw an error if the input is not a slug', () => {
		expect(() => parse(slug, 'not a slug')).toThrow();
	});
	it('should parse a string that contains understores', () => {
		expect(parse(slug, 'hello_world')).toBe('hello_world');
	});
	it('should parse a string that contains dashes', () => {
		expect(parse(slug, 'hello-world')).toBe('hello-world');
	});
	it('should parse any slugified string that is between 1 character and the maximum length', () => {
		expect(() => parse(slug, slugify('Can you believe this is a slugified string?'))).not.toThrow();
		expect(() => parse(slug, slugify('MyMessage: こんにちは'))).not.toThrow();
		expect(parse(slug, slugify('éêà'))).toBe('eea');
		expect(() => parse(slug, slugify('テストストリング'))).toThrow(); // non latin characters are stripped out, leaving an empty string
	});
});

import { email } from '$lib/schema/valibot';

describe('eamil', () => {
	it('should return the email string for valid email addresses', () => {
		expect(parse(email, 'test@example.com')).toBe('test@example.com');
		expect(parse(email, 'user.name+tag+sorting@example.com')).toBe(
			'user.name+tag+sorting@example.com'
		);
		expect(parse(email, 'user_name@sub.example.co')).toBe('user_name@sub.example.co');
		expect(parse(email, 'user_name@sub.example.co.jp')).toBe('user_name@sub.example.co.jp');
		expect(parse(email, 'user-name@sub.example.co.jp')).toBe('user-name@sub.example.co.jp');
	});

	it('should throw for incorrect email addresses', () => {
		expect(() => parse(email, 'plainaddress')).toThrow();
		expect(() => parse(email, 'missing-at-sign.com')).toThrow();
		expect(() => parse(email, 'user@.com')).toThrow();
		expect(() => parse(email, 'user@com.')).toThrow();
		expect(() => parse(email, '@missingusername.com')).toThrow();
		expect(() => parse(email, 'username@localhost')).toThrow();
	});

	it('should throw for empty and whitespace-only strings', () => {
		expect(() => parse(email, '')).toThrow();
		expect(() => parse(email, '   ')).toThrow();
	});

	it('should throw for emails with special characters in wrong places', () => {
		expect(() => parse(email, 'user..name@example.com')).toThrow(); // Double dots
		expect(() => parse(email, '.user@domain.com')).toThrow(); // Leading dot
		expect(() => parse(email, 'user@domain..com')).toThrow(); // Double dot in domain
	});

	it('should throw for emails with spaces', () => {
		expect(() => parse(email, 'user @domain.com')).toThrow();
		expect(() => parse(email, 'user@ domain.com')).toThrow();
		expect(() => parse(email, ' user@domain.com')).toThrow();
	});
});

import { url } from '$lib/schema/valibot';
describe('url', () => {
	it('should return the url string for valid URLs', () => {
		expect(parse(url, 'http://example.com')).toBe('http://example.com');
		expect(parse(url, 'https://example.com')).toBe('https://example.com');
		expect(parse(url, 'http://example.com/path')).toBe('http://example.com/path');
		expect(parse(url, 'http://example.com/path?query=string')).toBe(
			'http://example.com/path?query=string'
		);
		expect(parse(url, 'http://example.com/path?query=string#fragment')).toBe(
			'http://example.com/path?query=string#fragment'
		);
		// it should pass for URLs with spaces
		expect(parse(url, 'http://example.com/path with spaces')).toBe(
			'http://example.com/path with spaces'
		);
		expect(parse(url, 'http://example.com/path%20with%20encoded%20spaces')).toBe(
			'http://example.com/path%20with%20encoded%20spaces'
		);

		// it should pass for URLs with non latin characters
		expect(parse(url, 'http://example.com/テスト')).toBe('http://example.com/テスト');
	});

	it('should return the URL string even for that are not http or https', () => {
		expect(parse(url, 'ftp://example.com')).toBe('ftp://example.com');
		expect(parse(url, 'mailto:test@example.com')).toBe('mailto:test@example.com');
	});

	it('should throw when receiving just a domain', () => {
		expect(() => parse(url, 'example.com')).toThrow();
	});

	it('should throw when receiving non URL strings', () => {
		expect(() => parse(url, 'Lorem ipsum dolor sit amet')).toThrow();
	});

	it('should throw when receiving input that is not a string', () => {
		expect(() => parse(url, 123)).toThrow();
		expect(() => parse(url, null)).toThrow();
		expect(() => parse(url, true)).toThrow();
		expect(() => parse(url, undefined)).toThrow();
	});

	it('should throw for empty and whitespace-only strings', () => {
		expect(() => parse(url, '')).toThrow();
		expect(() => parse(url, '   ')).toThrow();
	});
});

import { uuid } from '$lib/schema/valibot';
describe('uuid', () => {
	it('should parse a UUID', () => {
		expect(parse(uuid, '123e4567-e89b-12d3-a456-426614174000')).toBe(
			'123e4567-e89b-12d3-a456-426614174000'
		);
	});
	it('should throw an error if the input is not a UUID', () => {
		expect(() => parse(uuid, 'not a UUID')).toThrow();
	});
	it('should throw an error if the input is not a string', () => {
		expect(() => parse(uuid, 123)).toThrow();
		expect(() => parse(uuid, null)).toThrow();
		expect(() => parse(uuid, true)).toThrow();
		expect(() => parse(uuid, undefined)).toThrow();
	});
	it('should throw an error if the input is an empty string', () => {
		expect(() => parse(uuid, '')).toThrow();
	});
});

import { domainOrUrl } from '$lib/schema/valibot';
describe('domainOrUrl', () => {
	it('should parse a valid domain', () => {
		expect(parse(domainOrUrl, 'example.com')).toBe('https://example.com/');
		expect(parse(domainOrUrl, 'acts.eco')).toBe('https://acts.eco/');
		expect(parse(domainOrUrl, 'good-domain.com')).toBe('https://good-domain.com/');
		expect(parse(domainOrUrl, 'sub.domain.co.uk')).toBe('https://sub.domain.co.uk/');
		expect(parse(domainOrUrl, 'sub.domain.co.uk/path')).toBe('https://sub.domain.co.uk/path');
	});

	it('should parse a valid URL, regardless of protocol', () => {
		expect(parse(domainOrUrl, 'https://example.com')).toBe('https://example.com/');

		expect(parse(domainOrUrl, 'http://sub.domain.co.uk/path')).toBe('http://sub.domain.co.uk/path');
		expect(parse(domainOrUrl, 'ftp://sub.domain.co.uk/path')).toBe('ftp://sub.domain.co.uk/path');
	});

	it('should throw for an invalid URL', () => {
		expect(() => parse(domainOrUrl, 'not a url')).toThrow();
	});

	it('should handle an extra slash in the protocol', () => {
		expect(parse(domainOrUrl, 'http:///example.com')).toBe('http://example.com/');
		expect(parse(domainOrUrl, 'https:///example.com')).toBe('https://example.com/');
		expect(parse(domainOrUrl, 'https:///example.com/')).toBe('https://example.com/');
	});

	it('should throw if the URL is too long', () => {
		const longUrl = 'https://example.com/' + 'a'.repeat(LONG_STRING_MAX_LENGTH);
		expect(() => parse(domainOrUrl, longUrl)).toThrow();
	});

	it('should throw for non-string inputs', () => {
		expect(() => parse(domainOrUrl, 123)).toThrow();
		expect(() => parse(domainOrUrl, null)).toThrow();
		expect(() => parse(domainOrUrl, {})).toThrow();
	});
});
