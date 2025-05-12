<script lang="ts">
	const { data } = $props();
	const dataGridOptions = {
		showHeader: false,
		fullWidthFilter: true,
		showFilter: false,
		showTopSeparator: false,
		showBottomSeparator: false
	};
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import H2 from '$lib/comps/typography/H2.svelte';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/comps/ui/button/button.svelte';
</script>

<DataGrid
	filterKey="search"
	items={data.from_signatures.items}
	count={data.from_signatures.count}
	title={'Email from signatures'}
	newItemHref="/settings/email/from_signatures/new"
	options={{ nothingFoundMessage: 'No from signatures found', showFilter: false }}
>
	{#snippet content(signature: (typeof data.from_signatures.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<div>{`${signature.name} <${signature.email}>`}</div>
			<Button href={`/settings/email/from_signatures/${signature.id}`} variant="outline" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/settings/email/from_signatures/new" variant="default" size="sm">
			{'Create new email from address'}
		</Button>
	{/snippet}
</DataGrid>
