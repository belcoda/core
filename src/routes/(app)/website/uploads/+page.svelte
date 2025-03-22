<script lang="ts">
	const { data } = $props();
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import RenderUpload from '$lib/comps/widgets/uploads/RenderUpload.svelte';
</script>

<DataGrid
	items={data.uploads.items}
	count={data.uploads.count}
	title={m.teal_front_cobra_devour()}
	options={{
		contentGridClass:
			'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-4',
		showBottomSeparator: false,
		showTopSeparator: false,
		contentHighlightHover: false,
		filterKey: 'file_name',
		nothingFoundMessage: m.tasty_busy_crossbill_buzz()
	}}
>
	{#snippet headerButton()}
		<Button href="/website/uploads/new">{m.mild_fine_bulldog_zip()}</Button>
	{/snippet}
	{#snippet content(item: (typeof data.uploads.items)[0])}
		<RenderUpload upload={item} showCopyButton={true} />
	{/snippet}
</DataGrid>
