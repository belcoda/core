<script lang="ts">
	const { data } = $props();
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import H1 from '$lib/comps/typography/H3.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Badge } from '$lib/comps/ui/badge/index.js';
	import Check from 'lucide-svelte/icons/check';
	import CheckCheck from 'lucide-svelte/icons/check-check';
</script>

<DataGrid
	items={data.sends.items}
	count={data.sends.count}
	title={m.each_alert_cougar_offer()}
	newItemHref={`/communications/whatsapp/${data.thread.id}/sends/new`}
	options={{ showFilter: true, showTopSeparator: true }}
>
	{#snippet headerButton()}
		<Button href="/communications/whatsapp/{data.thread.id}/sends/new"
			>{m.direct_just_buzzard_stab()}</Button
		>
	{/snippet}

	{#snippet content(send: (typeof data.sends.items)[0], i: number | undefined)}
		<div class="flex items-center justify-between gap-2">
			<div class="flex items-center justify-start gap-2">
				<div>
					<div class="font-medium">{send.list.name}</div>
					<div class="text-muted-foreground text-sm font-light">
						{data.timeAgo.format(send.started_at)}
					</div>
				</div>
			</div>
			{#if send.started_at && !send.completed_at}
				<div>
					<Badge>{m.funny_each_martin_wave()}</Badge>
				</div>
			{/if}
			{#if send.completed_at}
				<div>
					<Badge variant="outline"><Check size={12} /> {send.delivered}</Badge>
					<Badge variant="outline"><CheckCheck size={12} /> {send.read}</Badge>
				</div>
			{/if}
		</div>
	{/snippet}
</DataGrid>
