import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type Read as ReadEvent } from '$lib/schema/events/events';
import { type SupportedLanguage } from '$lib/i18n';

import { baseEventOptions } from '$lib/server/utils/email/context/events';

import { PUBLIC_HOST } from '$env/static/public';

type Input = {
	instance: ReadInstance;
	event: ReadEvent;
	language: SupportedLanguage;
};

import * as m from '$lib/paraglide/messages';
import { htmlToPlaintext } from '$lib/utils/text/string';
export function eventCancellationOptions(options: Input) {
	const eventOutput = baseEventOptions(options);
	const eventPageUrl = eventOutput.buttonUrl;
	return {
		language: options.language,
		subject: m.factual_heavy_shrike_thrive(
			{ eventTitle: eventOutput.title },
			{ locale: options.language }
		),
		title: eventOutput.title,
		body: m.jolly_lofty_chicken_work(
			{ eventTitle: eventOutput.title, dateTime: eventOutput.details.dateTime },
			{ locale: options.language }
		),
		bodyPlainText: htmlToPlaintext(
			m.gross_raw_gazelle_fetch(
				{ eventTitle: eventOutput.title, dateTime: eventOutput.details.dateTime },
				{ locale: options.language }
			)
		),
		previewText: m.just_patient_finch_mix({}, { locale: options.language }),
		buttonText: m.warm_wild_grebe_gasp({}, { locale: options.language }),
		buttonUrl: eventPageUrl,
		instanceName: options.instance.name,
		logoUrl: options.instance.settings.website.logo_url,
		logoAlt: m.lucky_strong_badger_tap(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		buttonAltHtml: m.slimy_top_octopus_drip({ url: eventPageUrl }, { locale: options.language }),
		buttonAltText: m.wise_cozy_poodle_dust({ url: eventPageUrl }, { locale: options.language }),
		copyright: m.ago_lofty_yak_pull(
			{ currentYear: new Date().getFullYear(), instanceName: options.instance.name },
			{ locale: options.language }
		)
	};
}
