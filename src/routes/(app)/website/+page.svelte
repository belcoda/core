<script lang="ts">
	let { data } = $props();
	import * as Card from '$lib/comps/ui/card';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.trite_grand_manatee_blend()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.known_acidic_scallop_mop()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/website/posts">{m.this_gaudy_opossum_expand()}</Button>
				<Button variant="outline" href="/website/posts/new">{m.extra_real_pigeon_tap()}</Button>
			</Grid>
		</Card.Content>
	</Card.Root>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.left_east_robin_propel()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/website/pages">{m.weak_upper_pelican_drum()}</Button>
				<Button variant="outline" href="/website/pages/new">{m.lucky_chunky_fly_view()}</Button>
			</Grid>
		</Card.Content>
	</Card.Root>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{m.cuddly_blue_kestrel_twist()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/website/uploads">{m.main_any_duck_radiate()}</Button>
				<Button variant="outline" href="/website/uploads/new">{m.brief_sour_wolf_grasp()}</Button>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
