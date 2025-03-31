<script lang="ts">
	const { data } = $props();
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import PersonDropdown from '$lib/comps/widgets/person/PersonDropdown.svelte';
	import * as Select from '$lib/comps/ui/select';
	import { invalidateAll } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	import { getFlash } from 'sveltekit-flash-message';
	import { Switch } from '$lib/comps/ui/switch';
	import { Label } from '$lib/comps/ui/label';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	const flash = getFlash(page);
	const loadingIds: Writable<number[]> = writable([]);

	const statuses = [
		{ value: 'member', label: 'Member' },
		{ value: 'admin', label: 'Admin' },
		{ value: 'banned', label: 'Banned' }
	];

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	let showBanned = $state(false);
	let loading = $state(false);
	async function handleBannedChange() {
		//set the params... invalidate;
		showBanned = !showBanned;
		if (browser) {
			loading = true;
			const params = new URLSearchParams(window.location.search);
			if (showBanned) {
				params.set('showBanned', 'true');
				await goto(`${window.location.pathname}?${params.toString()}`, { keepFocus: true });
			} else {
				params.delete('showBanned');
				await goto(`${window.location.pathname}?${params.toString()}`, { keepFocus: true });
			}
			loading = false;
		}
	}
	import Plus from 'lucide-svelte/icons/plus';
</script>

<DataGrid
	options={{ showFilter: false }}
	items={data.group.members}
	count={data.group.count}
	title={`${data.group.name} (${data.group.count})`}
	bind:loading
>
	{#snippet content(person: (typeof data.group.members)[0], i)}
		{#if typeof i === 'number'}
			<div class="flex items-center justify-between gap-4">
				{#if $loadingIds.includes(person.id)}
					<div class="saturate-0 animated animate-pulse text-muted-foreground">
						<PersonBadge {person} />
					</div>
				{:else}
					<PersonBadge {person} />
				{/if}

				<div class="flex items-center gap-2">
					{@render changeStatus(person)}
					{@render removePersonButton(person, i)}
				</div>
			</div>
		{/if}
	{/snippet}

	{#snippet headerButton()}
		<div class="flex items-center justify-end w-full lg:w-auto gap-4">
			<Button href="/people/groups/{data.group.id}">{m.super_broad_gopher_hurl()}</Button>
			{@render addPersonButton()}
		</div>
	{/snippet}
</DataGrid>
{@render toggleBanned()}

{#snippet addPersonButton()}
	<PersonDropdown
		selectedPersonIds={data.group.members.map((p) => p.id)}
		onAddPerson={async (person) => {
			$loadingIds = [...$loadingIds, person.id];
			//data.group.members = [...data.group.members, person]; //cannot include because there is no status for new person...
			const result = await fetch(`/api/v1/people/groups/${data.group.id}/members`, {
				method: 'POST',
				body: JSON.stringify({ person_id: person.id, status: 'member' })
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
		{m.yummy_extra_trout_pride()}
	</PersonDropdown>
{/snippet}

{#snippet removePersonButton(person: (typeof data.group.members)[0], i: number)}
	<Button
		variant="destructive"
		onclick={async () => {
			if (window.confirm(m.warm_cool_turkey_lead())) {
				$loadingIds = [...$loadingIds, person.id];
				const result = await fetch(`/api/v1/people/groups/${data.group.id}/members/${person.id}`, {
					method: 'DELETE'
				});
				if (!result.ok) {
					$flash = { type: 'error', message: m.basic_slimy_reindeer_treat() };
				}
				$flash = { type: 'success', message: m.level_aqua_clownfish_bask() };
				const personIndex = data.group.members.findIndex((p) => p.id === person.id);
				data.group.members = data.group.members.toSpliced(personIndex, 1);
				await invalidateAll();
				const loadingIdIndex = $loadingIds.findIndex((id) => id === person.id);
				$loadingIds = $loadingIds.toSpliced(loadingIdIndex, 1);
			}
		}}>{m.cool_weary_albatross_enchant()}</Button
	>
{/snippet}

{#snippet changeStatus(person: (typeof data.group.members)[0])}
	<Select.Root
		items={statuses}
		type="single"
		value={person.status}
		onValueChange={async (val) => {
			if (window.confirm(m.honest_arable_rook_hurl())) {
				if (!val) return;
				const status = val;
				$loadingIds = [...$loadingIds, person.id];
				const result = await fetch(`/api/v1/people/groups/${data.group.id}/members/${person.id}`, {
					method: 'PUT',
					body: JSON.stringify({ status })
				});
				if (!result.ok) {
					$flash = { type: 'error', message: m.basic_slimy_reindeer_treat() };
				}
				$flash = { type: 'success', message: m.curly_civil_loris_hack() };
				await invalidateAll();
				const loadingIdIndex = $loadingIds.findIndex((id) => id === person.id);
				$loadingIds = $loadingIds.toSpliced(loadingIdIndex, 1);
			}
		}}
	>
		<Select.Trigger class="w-[180px]">
			{statuses.find((val) => val.value === person.status)?.label || 'Select'}
		</Select.Trigger>
		<Select.Content>
			{#each statuses as status}
				<Select.Item value={status.value} label={status.label}>{status.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/snippet}

{#snippet toggleBanned()}
	<div class="flex items-center justify-end space-x-2 mt-4">
		<Switch id="show-banned" onCheckedChange={handleBannedChange} />
		<Label for="show-banned">{m.bald_keen_dolphin_arise()}</Label>
	</div>
{/snippet}
