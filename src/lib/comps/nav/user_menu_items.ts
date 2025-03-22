import Logout from 'lucide-svelte/icons/log-out';
import Cog from 'lucide-svelte/icons/cog';
import Settings from 'lucide-svelte/icons/settings-2';
import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';

import * as m from '$lib/paraglide/messages';

import type { Localization } from '$lib/i18n';

export default function (t: Localization) {
	return {
		my_tasks: {
			title: () => m.true_stale_anteater_adore(),
			href: () => '/tasks',
			icon: CircleCheckBig
		},
		settings: {
			title: () => m.aqua_dirty_opossum_flip(),
			href: () => '/settings',
			icon: Cog
		},

		logout: {
			title: () => m.cuddly_odd_tuna_intend(),
			href: () => '/logout',
			icon: Logout
		}
	};
}
