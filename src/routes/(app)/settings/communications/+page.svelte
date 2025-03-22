<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.late_odd_ladybug_zip()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.aqua_smug_stork_grin()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/communications/email/templates"
					>{m.solid_mealy_zebra_pride()}</Button
				>
				<Button variant="outline" href="/settings/communications/email/templates/new"
					>{m.long_blue_panda_learn()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
