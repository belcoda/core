import { PUBLIC_LOCALIZATION_COOKIE_NAME } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';
export const SUPPORTED_LANGUAGES = ['en', 'ja', 'pt', 'es', 'sw', 'fr', 'th', 'zh'] as const;
export const DEFAULT_LANGUAGE = 'en' as const;
export const SUPPORTED_COUNTRIES = [
	'us',
	'jp',
	'gb',
	'eg',
	'au',
	'ke',
	'lr',
	'ng',
	'tz',
	'sc',
	'es'
] as const;
export const DEFAULT_COUNTRY = 'us' as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];
export type DefaultLanguage = typeof DEFAULT_LANGUAGE;
export type LocalizationKey = {
	[key in SupportedLanguage]?: string;
} & {
	[key in DefaultLanguage]-?: string;
};
export type LocalizationFunction = (locale: SupportedLanguage, ...args: any[]) => string;
export type AlreadyLocalizedLocalizationFunction = (...args: any[]) => string;
export type SL = SupportedLanguage;

export function returnLocalizationString(locale: SupportedLanguage, key: LocalizationKey): string {
	if (key[locale] && typeof key[locale] === 'string') {
		//For some reason this cannot be statically analyzed? Let's make sure we check here if we are having issues...
		return key[locale] as string;
	} else {
		return key[DEFAULT_LANGUAGE];
	}
}

import * as i18n from './localizations';
export { i18n };
export type LocalizationObject = typeof i18n;

export function parseLocale(event: RequestEvent): SupportedLanguage {
	const url_locale = event.url.searchParams.get('lng');
	if (url_locale && SUPPORTED_LANGUAGES.includes(url_locale as SupportedLanguage)) {
		return url_locale as SupportedLanguage; //type casting to SupportedLanguage is ok as we are checking it above
	}
	const chosen_locale = event.cookies.get(PUBLIC_LOCALIZATION_COOKIE_NAME);
	if (chosen_locale && SUPPORTED_LANGUAGES.includes(chosen_locale as SupportedLanguage)) {
		return chosen_locale as SupportedLanguage; //type casting to SupportedLanguage is ok as we are checking it above
	}
	const accepted_language = event.request.headers.get('accept-language')?.split(',')[0].trim();
	if (accepted_language && SUPPORTED_LANGUAGES.includes(accepted_language as SupportedLanguage)) {
		return accepted_language as SupportedLanguage; //type casting to SupportedLanguage is ok as we are checking it above
	}
	return 'en';
}
export { default as Localization } from '$lib/i18n/localizations/index';
