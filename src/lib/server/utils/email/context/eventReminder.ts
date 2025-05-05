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

export function eventReminderOptions(options: Input) {
	const baseOutput = baseEventOptions(options);
	return {
		subject: m.cozy_agent_sloth_slide(
			{ eventTitle: options.event.heading },
			{ locale: options.language }
		),
		action: m.close_lucky_gull_hurl({}, { locale: options.language }),
		...baseOutput
	};
}
