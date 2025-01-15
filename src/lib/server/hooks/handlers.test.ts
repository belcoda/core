import { expect, describe, it } from 'vitest';
import { detectSubdomain } from '$lib/server/hooks/handlers';
import { DISALLOWED_NAMES_SET } from '$lib/utils/text/bad_names';
describe('detectSubdomain', () => {
	it('should return false if the host is the root domain', () => {
		expect(detectSubdomain('example.com', 'example.com')).toBe(false);
	});

	it('should return false if the host is localhost, regardless of the settings of the root domain', () => {
		expect(detectSubdomain('localhost:5173', 'example.com')).toBe(false);
	});

	it('should mistakenly return a root domain as a subdomain for multi-part ccTLDs/compound ccTLDs', () => {
		expect(detectSubdomain('example.com.au', 'example.com')).toBe('example');
	});

	it('should return false even for multi-part ccTLDs/compound ccTLDs if the host is the root domain', () => {
		expect(detectSubdomain('example.com.au', 'example.com.au')).toBe(false);
	});

	it('should return the subdomain if the host is not the root domain', () => {
		expect(detectSubdomain('sub.example.com', 'example.com')).toBe('sub');
	});

	it('should return the subdomain even if the root domain is a multi-part ccTLD/compound ccTLD', () => {
		expect(detectSubdomain('sub.example.com.au', 'example.com.au')).toBe('sub');
	});

	it('should return false if the subdomain is disallowed', () => {
		expect(detectSubdomain('mailgun.example.com', 'example.com')).toBe(false);
		expect(detectSubdomain('www.example.com', 'example.com')).toBe(false);
		expect(detectSubdomain('dashboard.example.com', 'example.com')).toBe(false);
	});
});
