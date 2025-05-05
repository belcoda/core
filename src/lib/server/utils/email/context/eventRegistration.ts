import { baseEventOptions } from '$lib/server/utils/email/context/events';
import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type Read as ReadEvent } from '$lib/schema/events/events';
import { type SupportedLanguage } from '$lib/i18n';

type Input = {
	instance: ReadInstance;
	event: ReadEvent;
	language: SupportedLanguage;
};

import * as m from '$lib/paraglide/messages';

export function eventRegistrationOptions(options: Input) {
	const baseOutput = baseEventOptions(options);
	return {
		subject: m.day_wise_newt_promise(
			{ eventTitle: options.event.heading },
			{ locale: options.language }
		),
		action: m.orange_sound_beaver_fear({}, { locale: options.language }),
		...baseOutput
	};
}
