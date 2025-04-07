<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
</script>

<DataGrid
	title={m.legal_due_myna_swim()}
	filterKey="name"
	items={data.threads.items}
	count={data.threads.count}
	newItemHref="/communications/whatsapp/new"
	options={{ nothingFoundMessage: m.sad_whole_ant_twist() }}
>
	{#snippet headerButton()}
		<Button href="/communications/whatsapp/new" variant="default" size="sm">
			{m.safe_strong_capybara_blink()}
		</Button>
	{/snippet}
	{#snippet content(send: (typeof data.threads.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<div class="font-medium">{send.name}</div>
			<Button href={`/communications/whatsapp/${send.id}`} variant="default" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
</DataGrid>
