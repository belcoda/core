<script lang="ts">
	export let data;
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Badge from '$lib/comps/ui/badge/badge.svelte';
</script>

<DataGrid
	title={data.t.pages.config.settings.tags.index()}
	items={data.tags.items}
	count={data.tags.count}
	newItemHref="/settings/tags/new"
>
	{#snippet headerButton()}
		<Button href="/settings/tags/new">{data.t.pages.config.settings.tags.new()}</Button>
	{/snippet}
	{#snippet content(item: typeof data.tags.items[0])}
		<div class="items-center flex justify-between gap-4">
			<div class="flex items-center gap-2">
				<div class="font-medium text-md">{item.name}</div>
				{#if item.active}<Badge class="bg-success-600">{data.t.common.status.active()}</Badge>
				{:else}
					<Badge class="bg-danger-600">{data.t.common.status.inactive()}</Badge>
				{/if}
			</div>
			<div>
				<div class="flex gap-4 items-center justify-end">
					<Button href="/settings/tags/{item.id}" variant="outline"
						>{data.t.forms.buttons.edit()}</Button
					>
				</div>
			</div>
		</div>
	{/snippet}
</DataGrid>
