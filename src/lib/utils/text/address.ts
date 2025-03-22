import type { Address } from '$lib/schema/valibot';
import {
	type SupportedCountry,
	type SupportedLanguage,
	DEFAULT_COUNTRY,
	DEFAULT_LANGUAGE
} from '$lib/i18n';
import { renderLocalizedCountryName } from '$lib/i18n/countries';
type AddressIncludingObject = {
	address_line_1: Address['address_line_1'];
	address_line_2: Address['address_line_2'];
	address_line_3: Address['address_line_3'];
	address_line_4: Address['address_line_4'];
	locality: Address['locality'];
	state: Address['state'];
	postcode: Address['postcode'];
	latlng: Address['latlng'];
	country: SupportedCountry;
	[key: string]: any;
};

export function renderAddress(
	object: AddressIncludingObject,
	t: App.Localization,
	instanceCountry: SupportedCountry = DEFAULT_COUNTRY
): { url: string; text: string } {
	const text = [
		object.address_line_1,
		object.address_line_2,
		object.address_line_3,
		object.address_line_4,
		object.locality,
		object.state,
		object.postcode,
		renderLocalizedCountryName(object.country || instanceCountry)
	]
		.filter(Boolean)
		.join(', ');

	const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;

	return { text, url };
}
