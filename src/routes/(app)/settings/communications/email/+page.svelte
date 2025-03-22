<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.steep_main_dingo_quiz()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.pretty_gaudy_flea_inspire()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/communications/email/templates"
					>{m.gross_factual_ant_roar()}</Button
				>
				<Button variant="outline" href="/settings/communications/email/templates/new"
					>{m.hour_plane_panda_enchant()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
