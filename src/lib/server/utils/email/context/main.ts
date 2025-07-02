import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type SupportedLanguage } from '$lib/i18n';

type Input = {
	instance: ReadInstance;
	body: string;
	previewText: string;
	language: SupportedLanguage;
	subject: string;
};

import * as m from '$lib/paraglide/messages';
import { htmlToPlaintext } from '$lib/utils/text/string';

export function mainEmailOptions(options: Input) {
	return {
		body: options.body,
		bodyPlainText: htmlToPlaintext(options.body),
		language: options.language,
		previewText: options.previewText,
		logoUrl: options.instance.settings.website.logo_url,
		logoAlt: m.lucky_strong_badger_tap(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		instanceUrl: options.instance.settings.home_page_url,
		copyright: m.ago_lofty_yak_pull(
			{ currentYear: new Date().getFullYear(), instanceName: options.instance.name },
			{ locale: options.language }
		),
		subject: options.subject
	};
}
