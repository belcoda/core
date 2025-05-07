import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type SupportedLanguage } from '$lib/i18n';

import { PUBLIC_HOST } from '$env/static/public';

type Input = {
	instance: ReadInstance;
	language: SupportedLanguage;
};

import * as m from '$lib/paraglide/messages';
import { htmlToPlaintext } from '$lib/utils/text/string';
export function newAdmin(options: Input) {
	const loginUrl = `${PUBLIC_HOST}/login`;
	return {
		language: options.language,
		subject: m.deft_deft_polecat_stab(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		title: m.whole_still_macaw_bless(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		body: m.loved_only_ibex_exhale(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		bodyPlainText: htmlToPlaintext(
			m.loved_only_ibex_exhale(
				{ instanceName: options.instance.name },
				{ locale: options.language }
			)
		),
		previewText: m.tasty_dark_dingo_laugh(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		buttonText: m.trick_many_alligator_twirl(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		buttonUrl: loginUrl,
		instanceName: options.instance.name,
		logoUrl: options.instance.settings.website.logo_url,
		logoAlt: m.lucky_strong_badger_tap(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		buttonAltHtml: m.slimy_top_octopus_drip({ url: loginUrl }, { locale: options.language }),
		buttonAltText: m.wise_cozy_poodle_dust({ url: loginUrl }, { locale: options.language }),
		copyright: m.ago_lofty_yak_pull(
			{ currentYear: new Date().getFullYear(), instanceName: options.instance.name },
			{ locale: options.language }
		)
	};
}
