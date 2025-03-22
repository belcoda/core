<script lang="ts">
	export let data;
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	title={m.noble_sunny_lion_inspire()}
	filterKey={'name'}
	count={data.templates.count}
	items={data.templates.items}
	newItemHref="/settings/communications/email/templates/new"
>
	{#snippet headerButton()}
		<Button href="/settings/communications/email/templates/new">{m.bad_crazy_cow_mend()}</Button>
	{/snippet}

	{#snippet content(template: (typeof data.templates.items)[0])}
		<div class="flex items-center gap-4 justify-between">
			<div class="font-medium">{template.name}</div>
			<Button href="/settings/communications/email/templates/{template.id}" variant="outline"
				>{m.giant_misty_shrimp_stop()}</Button
			>
		</div>
	{/snippet}
</DataGrid>
