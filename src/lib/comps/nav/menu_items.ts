import type { ComponentType, Component } from 'svelte'; //Compoment is deprecated in Svelte 5. Wait for Lucide to update its typings to the new Component type
import { type Icon } from 'lucide-svelte';

type MenuItem = {
	title: () => string;
	href: (pageParams?: Record<string, string>) => string;
	icon: ComponentType<Icon> | Component;
	children: {
		title: () => string;
		href: (pageParams?: Record<string, string>) => string;
		keyboardShortcut?: string;
		icon: ComponentType<Icon> | Component;
	}[];
};

import Dashboard from 'lucide-svelte/icons/area-chart';
//PEOPLE
import Users from 'lucide-svelte/icons/users';
import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
import Blend from 'lucide-svelte/icons/blend';
import List from 'lucide-svelte/icons/list';
//COMMUNICATIONS
import WhatsApp from '$lib/comps/icons/whatsapp.svelte';
import Send from 'lucide-svelte/icons/send';
import Envelope from 'lucide-svelte/icons/mail';
import MessageText from 'lucide-svelte/icons/message-square-text';
//WEBSITE
import Globe from 'lucide-svelte/icons/globe';
import NotePadText from 'lucide-svelte/icons/notepad-text';
import StickyNote from 'lucide-svelte/icons/sticky-note';
import FileUp from 'lucide-svelte/icons/file-up';
//EVENTS
import CalendarSearch from 'lucide-svelte/icons/calendar-search';
import CalendarClock from 'lucide-svelte/icons/calendar-clock';
import CalendarCheck from 'lucide-svelte/icons/calendar-check';
import CalendarPlus from 'lucide-svelte/icons/calendar-plus';
import Map from 'lucide-svelte/icons/map';
//ACTIONS
import FilePen from 'lucide-svelte/icons/file-pen';
import MessageCircleQuestion from 'lucide-svelte/icons/message-circle-question';
import HandCoins from 'lucide-svelte/icons/hand-coins';
import MailWarning from 'lucide-svelte/icons/mail-warning';
//SETTINGS
import Cog from 'lucide-svelte/icons/cog';
import Megaphone from 'lucide-svelte/icons/megaphone';
import BookKey from 'lucide-svelte/icons/book-key';

/* import { page as pageStore } from '$app/stores';
import { get } from 'svelte/store'; */
import type { Localization } from '$lib/i18n';
import * as m from '$lib/paraglide/messages';
/* const page = get(pageStore); */

function menus(t: Localization): { [key: string]: MenuItem } {
	return {
		top: {
			// don't actually need this title, href and icon -- this is just for the top level stuff
			title: () => m.wise_cool_ape_conquer(),
			href: () => '/people',
			icon: Users,
			children: [
				{
					title: () => m.wise_cool_ape_conquer(),
					href: () => '/people',
					icon: Users
				},
				{
					title: () => m.slow_tidy_termite_bubble(),
					href: () => '/communications',
					icon: Send
				},
				{
					title: () => m.day_teal_otter_flow(),
					href: () => '/website',
					icon: Globe
				},
				{
					title: () => m.bald_extra_chipmunk_fulfill(),
					href: () => '/events',
					icon: CalendarSearch
				},
				{
					title: () => m.sea_that_raven_trim(),
					href: () => '/petitions',
					icon: FilePen
				}
			]
		},
		people: {
			title: () => m.wise_cool_ape_conquer(),
			href: () => '/people',
			icon: Users,
			children: [
				{
					title: () => m.wise_cool_ape_conquer(),
					href: () => '/people',
					icon: Users
				},
				{
					title: () => m.moving_lazy_jurgen_rise(),
					href: () => '/people/filter',
					icon: SlidersHorizontal
				},
				{
					title: () => m.known_wise_ray_enrich(),
					href: () => '/people/groups',
					icon: Blend
				},
				{
					title: () => m.each_fancy_hamster_hurl(),
					href: () => '/people/lists',
					icon: List
				}
			]
		},
		communications: {
			title: () => m.slow_tidy_termite_bubble(),
			href: () => '/communications',
			icon: Send,
			children: [
				{
					title: () => m.green_equal_anaconda_read(),
					href: () => '/communications/whatsapp',
					icon: WhatsApp
				},
				{
					title: () => m.level_arable_pigeon_arise(),
					href: () => '/communications/email',
					icon: Envelope
				}
			]
		},
		website: {
			title: () => m.day_teal_otter_flow(),
			href: () => '/website',
			icon: Globe,
			children: [
				{
					title: () => m.ideal_upper_wren_favor(),
					href: () => '/website/pages',
					icon: NotePadText
				},
				{
					title: () => m.ornate_dirty_parrot_inspire(),
					href: () => '/website/posts',
					icon: StickyNote
				},
				{
					title: () => m.patchy_fancy_ocelot_stir(),
					href: () => '/website/uploads',
					icon: FileUp
				}
			]
		},
		events: {
			title: () => m.bald_extra_chipmunk_fulfill(),
			href: () => '/events',
			icon: CalendarSearch,
			children: [
				{
					title: () => m.bald_extra_chipmunk_fulfill(),
					href: () => '/events',
					icon: CalendarSearch
				}
			]
		},
		actions: {
			title: () => m.loud_watery_beetle_offer(),
			href: () => '/actions',
			icon: Dashboard,
			children: [
				{
					title: () => m.sea_that_raven_trim(),
					href: () => '/petitions',
					icon: FilePen
				}
			]
		},
		settings: {
			title: () => m.aqua_dirty_opossum_flip(),
			href: () => '/settings',
			icon: Cog,
			children: [
				{
					title: () => m.aqua_dirty_opossum_flip(),
					href: () => '/settings',
					icon: Cog
				},
				{
					title: () => m.few_clean_hornet_fall(),
					href: () => '/settings/admins',
					icon: Users
				},
				{
					title: () => m.long_great_dachshund_favor(),
					href: () => '/settings/website',
					icon: Globe
				},
				{
					title: () => m.tough_slow_liger_walk(),
					href: () => '/settings/secrets',
					icon: BookKey
				}
			]
		},
		tasks: {
			title: () => m.jumpy_every_ray_fond(),
			href: () => '/tasks',
			icon: Dashboard,
			children: [
				{
					title: () => m.mean_caring_manatee_charm(),
					href: () => '/tasks',
					icon: Dashboard
				}
			]
		}
	};
}

export default menus;
