<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import { list as listPeople, type List as ListPeople } from '$lib/schema/people/people';
	import {
		filterGroup,
		DEFAULT_FILTER_GROUP,
		type FilterGroup
	} from '$lib/schema/people/filters/filters';
	let filter = $state<FilterGroup>(DEFAULT_FILTER_GROUP);
	//let filter = $state(DEFAULT_FILTER_GROUP);
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import FilterGroupWidget from './FilterGroupWidget.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';

	import { getFlash } from 'sveltekit-flash-message';
	import { parse } from '$lib/schema/valibot';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	const flash = getFlash(page);

	let people: ListPeople = $state({ items: [], count: 0 });
	let hasSearched = $state(false);

	async function runFilter() {
		try {
			hasSearched = false;
			const parsed = parse(filterGroup, filter);
			const result = await fetch(`/api/v1/people/filter`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(parsed)
			});
			if (!result.ok) {
				throw new Error(m.teary_dizzy_earthworm_urge());
			}
			const body = await result.json();
			const parsedPeople = parse(listPeople, body);
			people = parsedPeople;
			hasSearched = true;
			$flash = {
				type: 'success',
				message: m.merry_bright_koala_glow({ count: people.count.toString() })
			};
			document.getElementById('results')?.scrollIntoView();
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}

	async function createList() {
		try {
			const parsed = parse(filterGroup, filter);
			const result = await fetch(`/api/v1/people/filter/create_list`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(parsed)
			});
			if (!result.ok) {
				throw new Error(m.teary_dizzy_earthworm_urge());
			}
			$flash = { type: 'success', message: m.bright_suave_dove_arise() };
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}
</script>

<PageHeader title={m.tired_clean_grizzly_link()} separator={false} class="mb-6" />

<FilterGroupWidget bind:filter root={true} onDelete={() => {}} />

<div class="flex justify-end">
	<Button class="mt-6" onclick={runFilter}>{m.top_raw_impala_twirl()}</Button>
</div>

<span id="results"></span>
{#if hasSearched}
	<Separator class="my-6" />
	<DataGrid
		options={{ showFilter: false }}
		title={m.smug_lost_hamster_spin()}
		items={people.items}
		count={people.count}
	>
		{#snippet content(person: (typeof people.items)[0])}
			<div class="flex justify-between items-center w-full py-2 pl-2">
				<div><PersonBadge {person} /></div>
				<div>
					<Button variant="outline" href="/people/{person.id}">{m.dull_fluffy_jannes_hike()}</Button
					>
				</div>
			</div>
		{/snippet}

		{#snippet headerButton()}
			<Button onclick={createList}>{m.elegant_quaint_dog_dart()}</Button>
		{/snippet}
	</DataGrid>
{/if}
