import { type SupportedCountry } from '$lib/i18n';
import * as m from '$lib/paraglide/messages';

export function renderLocalizedCountryName(countryCode: SupportedCountry): string {
	switch (countryCode) {
		case 'au':
			return m.gaudy_due_okapi_gaze();
		case 'eg':
			return m.fit_simple_emu_flip();
		case 'jp':
			return m.livid_cool_martin_bump();
		case 'ke':
			return m.short_legal_halibut_drop();
		case 'lr':
			return m.strong_only_firefox_heart();
		case 'ng':
			return m.such_lucky_raven_delight();
		case 'sc':
			return m.equal_major_panda_pray();
		case 'tz':
			return m.known_fluffy_hawk_grace();
		case 'gb':
			return m.active_left_tern_sway();
		case 'us':
			return m.active_mean_donkey_chop();
		case 'es':
			return m.antsy_sea_goose_trip();
		default:
			return countryCode;
	}
}

export function renderFlags(countryCode: SupportedCountry): string {
	switch (countryCode) {
		case 'au':
			return '🇦🇺';
		case 'eg':
			return '🇪🇬';
		case 'jp':
			return '🇯🇵';
		case 'ke':
			return '🇰🇪';
		case 'lr':
			return '🇱🇷';
		case 'ng':
			return '🇳🇬';
		case 'sc':
			return '🇸🇨';
		case 'tz':
			return '🇹🇿';
		case 'gb':
			return '🇬🇧';
		case 'us':
			return '🇺🇸';
		case 'es':
			return '🇪🇸';
		default:
			return '🏳️';
	}
}
