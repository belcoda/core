<script lang="ts">
	export let data;
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
</script>

<DataGrid
	title={m.heroic_just_crocodile_chop()}
	items={data.pages.items}
	count={data.pages.count}
	newItemHref="/website/pages/new"
	options={{ nothingFoundMessage: m.candid_grand_spider_spark() }}
>
	{#snippet headerButton()}
		<Button href="/website/pages/new">{m.lime_proof_shark_emerge()}</Button>
	{/snippet}
	{#snippet content(content: (typeof data.pages.items)[0])}
		<div class="flex items-center justify-between gap-4">
			<div>{content.name}</div>
			<div class="flex items-center gap-2">
				<Button variant="outline" href={`/website/pages/${content.id}/preview`} target="_blank"
					>{m.alive_silly_antelope_build()}</Button
				>
				<Button href={`/website/pages/${content.id}`} variant="default"
					>{m.giant_misty_shrimp_stop()}</Button
				>
			</div>
		</div>
	{/snippet}
</DataGrid>
