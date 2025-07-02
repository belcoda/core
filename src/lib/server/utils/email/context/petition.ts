import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type Read as ReadPetition } from '$lib/schema/petitions/petitions';
import { type SupportedLanguage } from '$lib/i18n';
import { htmlToPlaintext } from '$lib/utils/text/string';
import { PUBLIC_HOST } from '$env/static/public';

type Input = {
	instance: ReadInstance;
	petition: ReadPetition;
	language: SupportedLanguage;
};

import { dev } from '$app/environment';

import * as m from '$lib/paraglide/messages';

export function basePetitionOptions(options: Input) {
	const petitionUrl = `${dev ? 'http://' : 'https://'}${options.instance.slug}.${PUBLIC_HOST}/petitions/${options.petition.slug}`;
	return {
		language: options.language,
		title: m.each_such_worm_radiate(),
		body: m.helpful_grassy_wren_yell(
			{ petitionName: options.petition.heading },
			{ locale: options.language }
		),
		bodyPlainText: htmlToPlaintext(
			m.helpful_grassy_wren_yell(
				{ petitionName: options.petition.heading },
				{ locale: options.language }
			)
		),
		previewText: m.same_light_mink_soar(
			{ petitionName: options.petition.heading },
			{ locale: options.language }
		),
		buttonText: m.solid_civil_butterfly_fear(),
		buttonUrl: petitionUrl,
		instanceName: options.instance.name,
		logoUrl: options.instance.settings.website.logo_url,
		logoAlt: m.lucky_strong_badger_tap(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		buttonAltHtml: m.slimy_top_octopus_drip({ url: petitionUrl }, { locale: options.language }),
		buttonAltText: m.wise_cozy_poodle_dust({ url: petitionUrl }, { locale: options.language }),
		copyright: m.ago_lofty_yak_pull(
			{ currentYear: new Date().getFullYear(), instanceName: options.instance.name },
			{ locale: options.language }
		)
	};
}
