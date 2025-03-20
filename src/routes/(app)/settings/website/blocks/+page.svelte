<script lang="ts">
	export let data;
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	title={m.low_basic_dolphin_dream()}
	filterKey={'name'}
	count={data.blocks.count}
	items={data.blocks.items}
	newItemHref="/settings/website/blocks/new"
>
	{#snippet headerButton()}
		<Button href="/settings/website/blocks/new">{m.vivid_these_manatee_roam()}</Button>
	{/snippet}

	{#snippet content(block: (typeof data.blocks.items)[0])}
		<div class="flex items-center gap-4 justify-between">
			<div class="font-medium">{block.name}</div>
			<Button href="/settings/website/blocks/{block.id}" variant="outline"
				>{m.giant_misty_shrimp_stop()}</Button
			>
		</div>
	{/snippet}
</DataGrid>
