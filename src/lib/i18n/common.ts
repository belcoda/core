/* 
This is a file with common localization strings that can be re-used in the application as needed. 

However, generally, when amending or adding new strings, it is recommended to add them to the specific file that they are used in -- and to create a new localization string in every instance. 
We shouldn't be editing the messages directly too much, as it can lead to unexpected changes if we don't remember to check every single reference to that message.

*/

import * as m from '$lib/paraglide/messages';
export const errors = [
	m.teary_dizzy_earthworm_urge(), //generic()
	m.spry_ago_baboon_cure(), //http 500
	m.stock_minor_barbel_zip(), //http 400
	m.that_tasty_dove_pop(), //http 404
	m.full_grand_pelican_assure(), //http 403
	m.due_swift_lizard_list(), //http 401
	m.pretty_tired_fly_lead(), //not found
	m.early_nimble_jackal_trim(), //udpating data
	m.royal_aware_jay_build(),
	m.loud_bland_lionfish_pray(),
	m.deft_agent_parakeet_peek(),
	m.spare_mushy_dachshund_quell()
];

export const pages = [
	m.game_loose_wombat_twirl(),
	m.sea_that_raven_trim(),
	m.bald_extra_chipmunk_fulfill(),
	m.loud_watery_beetle_offer(),
	m.day_teal_otter_flow(),
	m.ideal_upper_wren_favor(),
	m.ornate_dirty_parrot_inspire(),
	m.patchy_fancy_ocelot_stir(),
	m.aqua_dirty_opossum_flip(),
	m.ideal_fair_polecat_loop(),
	m.honest_green_moose_rise(),
	m.wise_cool_ape_conquer(),
	m.slow_tidy_termite_bubble(),
	m.level_arable_pigeon_arise(),
	m.green_equal_anaconda_read()
];

export const actions = [m.flat_sleek_millipede_agree(), m.white_acidic_koala_pop()];

export const buttons = [
	m.just_away_horse_urge(),
	m.empty_warm_squirrel_chop(),
	m.super_broad_gopher_hurl(),
	m.giant_misty_shrimp_stop(),
	m.dull_fluffy_jannes_hike(),
	m.alive_silly_antelope_build(),
	m.low_hour_pig_talk()
];

export const basicFields = [
	m.extra_wild_earthworm_commend(),
	m.livid_spicy_felix_dance(),
	m.heroic_mean_poodle_absorb(),
	m.whole_sweet_slug_attend(),
	m.green_broad_porpoise_advise(),
	m.aqua_funny_crocodile_earn()
];
