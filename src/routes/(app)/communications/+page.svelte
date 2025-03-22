<script lang="ts">
	let { data } = $props();
	import * as Card from '$lib/comps/ui/card';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.basic_born_pig_affirm()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.still_best_wren_enrich()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/communications/email">{m.heroic_aloof_eel_bloom()}</Button>
				<Button variant="outline" href="/communications/email/new"
					>{m.sour_dark_cougar_praise()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
