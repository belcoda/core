<script lang="ts">
	export let data;
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
</script>

<DataGrid
	filterKey="name"
	items={data.lists.items}
	count={data.lists.count}
	title={m.whole_civil_gull_accept()}
	newItemHref="/people/lists/new"
>
	{#snippet content(list: (typeof data.lists.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			{list.name}
			<Button href={`/people/lists/${list.id}`} variant="outline" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/people/lists/new" variant="default" size="sm">
			{m.minor_sleek_fish_grin()}
		</Button>
	{/snippet}
</DataGrid>
