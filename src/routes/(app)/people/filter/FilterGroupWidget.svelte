<script lang="ts">
	import { type FilterGroup } from '$lib/schema/people/filters/filters';
	import { defaultFullName } from '$lib/schema/people/filters/defaults';
	import FilterGroupWidet from './FilterGroupWidget.svelte';
	import { page } from '$app/stores';
	let {
		filter = $bindable(),
		root,
		onDelete
	}: {
		filter: FilterGroup;
		root: boolean;
		onDelete: () => void;
	} = $props();
	import AndOrNot from './AndOrNot.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import X from 'lucide-svelte/icons/x';
	import { Grid } from '$lib/comps/ui/forms';
	import FilterWidget from './FilterWidget.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="bg-background rounded-lg shadow my-6 border">
	{#if !root}
		<div class="flex w-full justify-end border-b bg-slate-100 rounded-t">
			<Button
				size="sm"
				variant="ghost"
				onclick={() => {
					if (!root) onDelete();
				}}
			>
				<X size={14} />
			</Button>
		</div>
	{/if}

	{#if filter.filters.length > 0}
		<Grid cols={1} class="divide-y">
			{#each filter.filters as _, i}
				<FilterWidget
					bind:filter={filter.filters[i]}
					onDelete={() => {
						filter.filters.splice(i, 1);
					}}
				/>
			{/each}
		</Grid>
	{/if}
	<div class="p-4">
		{#each filter.groups as _, i}
			<FilterGroupWidet
				bind:filter={filter.groups[i]}
				root={false}
				onDelete={() => {
					filter.groups.splice(i, 1);
				}}
			/>
		{/each}
	</div>

	<div class="flex items-center justify-end gap-2 p-4">
		<AndOrNot bind:logic={filter.logic} />
		<!-- <Button onclick={() => filter.groups.push(structuredClone(DEFAULT_FILTER_GROUP))}
			>{"Add filter group"}</Button
		> -->
		<!-- TODO: There's a strange bug here with recursive state triggering multiple group creation -->
		<Button onclick={() => filter.filters.push(structuredClone(defaultFullName))}
			>{m.loose_arable_jurgen_hurl()}</Button
		>
	</div>
</div>
