<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	export let data;
	import LanguageSelect from './LanguageSelect.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.acidic_east_jan_taste()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.silly_born_porpoise_gasp()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<LanguageSelect superform={data.form} />
		</Card.Content>
	</Card.Root>
</Grid>

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.small_last_walrus_flop()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/admins">{m.empty_plain_cat_pray()}</Button>
				<Button variant="outline" href="/settings/admins/new">{m.few_clean_wallaby_dust()}</Button>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.civil_zany_gorilla_clap()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/tags">{m.mealy_stock_lynx_jump()}</Button>
				<Button variant="outline" href="/settings/tags/new">{m.good_just_weasel_twirl()}</Button>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.pretty_ideal_earthworm_spin()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/communications/email/templates"
					>{m.raw_fit_mare_scold()}</Button
				>
				<Button variant="outline" href="/settings/communications/email/templates/new"
					>{m.good_awful_warbler_attend()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.teary_fair_gazelle_create()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/website">{m.actual_proud_stingray_renew()}</Button
				>
				<Button variant="outline" href="/settings/website/blocks"
					>{m.raw_noisy_halibut_heal()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.simple_home_squid_offer()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/people/imports"
					>{m.slow_tired_bumblebee_dream()}</Button
				>
				<Button variant="outline" href="/settings/people/imports/new"
					>{m.top_maroon_grizzly_edit()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
