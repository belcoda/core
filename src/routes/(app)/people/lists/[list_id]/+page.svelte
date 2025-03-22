<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import PersonDropdown from '$lib/comps/widgets/person/PersonDropdown.svelte';
	import { invalidateAll } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	const flash = getFlash(page);
	const loadingIds: Writable<number[]> = writable([]);
	import Plus from 'lucide-svelte/icons/plus';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	options={{ showFilter: false, nothingFoundMessage: m.warm_quiet_bulldog_roar() }}
	items={data.list.people.items}
	count={data.list.people.count}
	title={`${data.list.name} (${data.list.count})`}
>
	{#snippet content(person: (typeof data.list.people.items)[0])}
		<div class="flex items-center justify-between gap-4">
			{#if $loadingIds.includes(person.id)}
				<div class="saturate-0 animated animate-pulse text-muted-foreground">
					<PersonBadge {person} />
				</div>
			{:else}
				<PersonBadge {person} />
			{/if}

			<div>
				<Button
					variant="destructive"
					onclick={async () => {
						$loadingIds = [...$loadingIds, person.id];
						const result = await fetch(`/api/v1/people/${person.id}/lists/${data.list.id}`, {
							method: 'DELETE'
						});
						if (!result.ok) {
							$flash = { type: 'error', message: m.basic_slimy_reindeer_treat() };
						}
						$flash = { type: 'success', message: m.red_loud_oryx_love() };
						const personIndex = data.list.people.items.findIndex((p) => p.id === person.id);
						data.list.people.items = data.list.people.items.toSpliced(personIndex, 1);
						await invalidateAll();
						const loadingIdIndex = $loadingIds.findIndex((id) => id === person.id);
						$loadingIds = $loadingIds.toSpliced(loadingIdIndex, 1);
					}}>{m.close_north_termite_commend()}</Button
				>
			</div>
		</div>
	{/snippet}

	{#snippet headerButton()}
		<div class="flex items-center justify-end w-full lg:w-auto gap-4">
			<PersonDropdown
				selectedPersonIds={data.list.people.items.map((p) => p.id)}
				onAddPerson={async (person) => {
					$loadingIds = [...$loadingIds, person.id];
					data.list.people.items = [...data.list.people.items, person];
					const result = await fetch(`/api/v1/people/${person.id}/lists/${data.list.id}`, {
						method: 'POST'
					});
					if (!result.ok) {
						$flash = { type: 'error', message: m.basic_slimy_reindeer_treat() };
					}
					$flash = { type: 'success', message: m.flat_sleek_millipede_agree() };
					await invalidateAll();
					const loadingIdIndex = $loadingIds.findIndex((id) => id === person.id);
					$loadingIds = $loadingIds.toSpliced(loadingIdIndex, 1);
				}}
			>
				<Plus size={14} />
				{m.ideal_spry_snail_fade()}
			</PersonDropdown>
			<Button href="/people/lists/{data.list.id}/edit">{m.giant_misty_shrimp_stop()}</Button>
		</div>
	{/snippet}
</DataGrid>
