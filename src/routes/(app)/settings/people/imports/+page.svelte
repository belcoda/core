<script>
	import { page } from '$app/stores';
	export let data;
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Avatar from '$lib/comps/ui/custom/avatar/avatar.svelte';
	import { Badge } from '$lib/comps/ui/badge';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Date from '$lib/comps/ui/form/datetime/date.svelte';
</script>

<DataGrid
	title={m.loud_full_jellyfish_kick()}
	items={data.imports.items}
	count={data.imports.count}
	newItemHref="/settings/people/imports/new"
>
	{#snippet headerButton()}
		<Button href="/settings/people/imports/new">{m.away_level_emu_affirm()}</Button>
	{/snippet}

	{#snippet content(importItem)}
		<div class="flex justify-between items-center gap-4">
			<div>
				<div>
					{importItem.created_at.toLocaleString(data.language, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						timeZoneName: 'short'
					})}
				</div>
				<div class="text-muted-foreground text-sm">
					{data.timeAgo.format(importItem.created_at)}
				</div>
			</div>
			<div class="hidden lg:block">
				{#if importItem.status === 'complete'}
					<div class="flex items-center gap-2">
						<Badge class="ml-3" variant="success"
							>{m.active_simple_javelina_spur({ count: importItem.processed_rows.toFixed(0) })}
						</Badge>
						<Badge class="ml-3" variant="danger"
							>{m.sound_tired_grizzly_attend({
								count: importItem.failed_rows.toFixed(0)
							})}</Badge
						>
					</div>
				{:else if importItem.status === 'pending'}
					<Badge class="ml-3">{m.wacky_short_mouse_clap()}</Badge>
				{:else if importItem.status === 'processing'}
					<Badge class="ml-3" variant="warning">{m.giant_sleek_hawk_devour()}</Badge>
				{:else}
					<Badge class="ml-3" variant="danger">{m.jumpy_whole_slug_bake()}</Badge>
				{/if}
			</div>
		</div>
	{/snippet}
</DataGrid>
