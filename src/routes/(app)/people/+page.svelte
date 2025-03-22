<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import TagFilter from '$lib/comps/widgets/tags/TagFilter.svelte';
	import Filter from 'lucide-svelte/icons/filter';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';

	async function onAddTag(tagId: number) {
		const params = new URLSearchParams(window.location.search);
		params.append('tag', tagId.toString());
		await goto(`${window.location.pathname}?${params.toString()}`, { keepFocus: true });
	}

	async function onRemoveTag(tagId: number) {
		const params = new URLSearchParams(window.location.search);
		params.delete('tag', tagId.toString());
		if (params.keys.length > 0) {
			await goto(`${window.location.pathname}?${params.toString()}`, { keepFocus: true });
		} else {
			await goto(`${window.location.pathname}`, { keepFocus: true });
		}
	}
</script>

<DataGrid
	title={m.round_new_ape_offer()}
	items={data.people.items}
	count={data.people.count}
	filterKey="search"
	newItemHref="/people/new"
	options={{
		filterPlaceholder: m.seemly_that_warthog_explore(),
		nothingFoundMessage: m.weird_that_earthworm_foster()
	}}
>
	{#snippet filterSnippet(filter)}
		<div class="flex items-center gap-2">
			<TagFilter
				{onAddTag}
				{onRemoveTag}
				buttonText={m.legal_kind_ape_twist()}
				ButtonIcon={Filter}
			/>
			{@render filter()}
		</div>
	{/snippet}
	{#snippet content(person: (typeof data.people.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<PersonBadge {person} />
			<Button href={`/people/${person.id}`} variant="outline" size="sm">
				{m.dull_fluffy_jannes_hike()}
			</Button>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/people/new" variant="default" size="sm">
			{m.upper_seemly_swan_race()}
		</Button>
	{/snippet}
</DataGrid>
