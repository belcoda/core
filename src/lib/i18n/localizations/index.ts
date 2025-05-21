import { type SupportedLanguage } from '$lib/i18n/index'; // this is a type-only circular dependency so probably okay
import errors from '$lib/i18n/localizations/errors';
import pages from '$lib/i18n/localizations/pages';
import forms from '$lib/i18n/localizations/forms';
import common from '$lib/i18n/localizations/common';
import events from '$lib/i18n/localizations/events';
import people from '$lib/i18n/localizations/people';
import countries from '$lib/i18n/localizations/countries';
import flags from '$lib/i18n/localizations/flags';
import email from '$lib/i18n/localizations/email';
import communications from '$lib/i18n/localizations/communications';

// sections
import config from '$lib/i18n/localizations/config';

class Localization {
	public locale: SupportedLanguage;
	public errors: ReturnType<typeof errors>;
	public pages: ReturnType<typeof pages>;
	public forms: ReturnType<typeof forms>;
	public config: ReturnType<typeof config>;
	public common: ReturnType<typeof common>;
	public events: ReturnType<typeof events>;
	public people: ReturnType<typeof people>;
	public countries: ReturnType<typeof countries>;
	public flags: ReturnType<typeof flags>;
	public email: ReturnType<typeof email>;
	public communications: ReturnType<typeof communications>;

	constructor(locale: SupportedLanguage) {
		this.locale = locale;
		this.errors = errors(this.locale);
		this.pages = pages(this.locale);
		this.forms = forms(this.locale);
		this.config = config(this.locale);
		this.common = common(this.locale);
		this.events = events(this.locale);
		this.people = people(this.locale);
		this.countries = countries(this.locale);
		this.flags = flags(this.locale);
		this.email = email(this.locale);
		this.communications = communications(this.locale);
	}
}
export default Localization;
