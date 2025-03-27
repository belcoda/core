<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import WebsiteConfigForm from './WebsiteConfigForm.svelte';
	const { data } = $props();
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.novel_teary_toad_adapt()} />
<div class="mt-6"><WebsiteConfigForm superform={data.form} /></div>

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.petty_mad_duck_spin()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/website/blocks"
					>{m.plane_noble_jurgen_attend()}</Button
				>
				<Button variant="outline" href="/settings/website/blocks/new"
					>{m.each_just_husky_treasure()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
