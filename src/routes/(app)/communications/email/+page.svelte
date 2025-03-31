<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	filterKey="search"
	items={data.sends.items}
	count={data.sends.count}
	title={m.level_active_dove_foster()}
	newItemHref="/communications/email/new"
	options={{ nothingFoundMessage: m.sound_same_puma_animate() }}
>
	{#snippet content(send: (typeof data.sends.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<div>{send.name}</div>
			<Button href={`/communications/email/${send.id}`} variant="outline" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/communications/email/new" variant="default" size="sm">
			{m.careful_honest_deer_enchant()}
		</Button>
	{/snippet}
</DataGrid>
