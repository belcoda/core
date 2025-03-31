<script lang="ts">
	export let data;
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import type { List } from '$lib/schema/petitions/petitions';
	import AdminBadge from '$lib/comps/widgets/AdminBadge.svelte';
</script>

<DataGrid
	title={m.elegant_active_giraffe_nurture()}
	items={data.petitions.items}
	count={data.petitions.count}
	newItemHref="/petitions/new"
	options={{ nothingFoundMessage: m.patchy_tough_racoon_mop() }}
>
	{#snippet headerButton()}
		<Button href="/petitions/new">{m.noisy_fancy_gecko_conquer()}</Button>
	{/snippet}
	{#snippet content(item: List['items'][0])}
		<div class="items-center flex justify-between gap-4">
			<div>
				<a href="/petitions/{item.id}">
					<div class="font-medium text-md">{item.name}</div>
				</a>
			</div>
			<div>
				<div class="flex gap-4 items-center justify-end">
					<AdminBadge admin={item.point_person} />
					<Button href="/petitions/{item.id}" variant="outline"
						>{m.dull_fluffy_jannes_hike()}</Button
					>
				</div>
			</div>
		</div>
	{/snippet}
</DataGrid>
