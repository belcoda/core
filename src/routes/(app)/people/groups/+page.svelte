<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	title={m.livid_few_duck_embrace()}
	filterKey="name"
	items={data.groups.items}
	count={data.groups.count}
	newItemHref="/people/groups/new"
	options={{ nothingFoundMessage: m.stock_many_fish_breathe() }}
>
	{#snippet content(group: (typeof data.groups.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<div class="font-medium">{group.name}</div>
			<Button href={`/people/groups/${group.id}`} variant="outline" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/people/groups/new" variant="default" size="sm">
			{m.house_muddy_panda_drum()}
		</Button>
	{/snippet}
</DataGrid>
