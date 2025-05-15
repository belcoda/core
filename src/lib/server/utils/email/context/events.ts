import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type Read as ReadEvent } from '$lib/schema/events/events';
import { type SupportedLanguage } from '$lib/i18n';

import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';

type Input = {
	instance: ReadInstance;
	event: ReadEvent;
	language: SupportedLanguage;
};

import { dev } from '$app/environment';

import * as m from '$lib/paraglide/messages';

import { formatDateTimeRange } from '$lib/utils/text/date';
import { renderAddress } from '$lib/utils/text/address';
import { htmlToPlaintext } from '$lib/utils/text/string';
import { convertToTimezone } from '$lib/utils/date/datetime';
export function baseEventOptions(options: Input) {
	const eventUrl = `${dev ? 'http://' : 'https://'}${options.instance.slug}.${PUBLIC_ROOT_DOMAIN}/events/${options.event.slug}`;
	return {
		title: options.event.heading,
		featureImage: options.event.feature_image?.url || null,
		featureImageAlt: options.event.heading,
		language: options.language,
		previewText: m.slow_fresh_cod_roar(
			{ eventName: options.event.heading },
			{ locale: options.language }
		),
		details: {
			text: {
				when: m.calm_tame_macaw_slide({}, { locale: options.language }),
				where: m.vivid_spare_sparrow_express({}, { locale: options.language }),
				link: m.weird_cozy_sparrow_pull({}, { locale: options.language })
			},
			isOnline: options.event.online,
			dateTime: formatDateTimeRange(
				convertToTimezone(options.event.starts_at, options.event.timezone),
				convertToTimezone(options.event.ends_at, options.event.timezone),
				options.language,
				options.event.timezone
			),
			address: renderAddress(options.event, options.instance.country),
			onlineUrl: options.event.online_url
		},
		buttonText: m.vivid_cuddly_turtle_savor({}, { locale: options.language }),
		buttonUrl: eventUrl,
		instanceName: options.instance.name,
		logoUrl: options.instance.settings.website.logo_url,
		logoAlt: m.lucky_strong_badger_tap(
			{ instanceName: options.instance.name },
			{ locale: options.language }
		),
		instanceUrl: options.instance.settings.home_page_url,
		buttonAltHtml: m.slimy_top_octopus_drip({ url: eventUrl }, { locale: options.language }),
		buttonAltText: m.wise_cozy_poodle_dust({ url: eventUrl }, { locale: options.language }),
		copyright: m.ago_lofty_yak_pull(
			{ currentYear: new Date().getFullYear(), instanceName: options.instance.name },
			{ locale: options.language }
		)
	};
}

export function registered(options: Input) {
	return {
		...baseEventOptions(options),
		action: m.proud_noisy_cougar_aid({}, { locale: options.language })
	};
}

export async function reminder(options: Input) {
	return {
		...baseEventOptions(options),
		action: m.cute_nimble_lobster_pat({}, { locale: options.language })
	};
}

export async function cancelled(options: Input) {
	return {
		...baseEventOptions(options),
		action: m.early_such_alpaca_blend({}, { locale: options.language }),
		body: m.great_antsy_clownfish_conquer(
			{ eventName: options.event.heading },
			{ locale: options.language }
		),
		bodyPlainText: htmlToPlaintext(
			m.great_antsy_clownfish_conquer(
				{ eventName: options.event.heading },
				{ locale: options.language }
			)
		)
	};
}
