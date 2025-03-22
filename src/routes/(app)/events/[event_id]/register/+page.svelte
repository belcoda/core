<script lang="ts">
	export let data;
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import RegisterPersonForm from './RegisterPersonForm.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	title={m.frail_sound_rabbit_heal()}
	items={data.people.items}
	count={data.people.count}
	filterKey={'search'}
>
	{#snippet content(person: (typeof data.people.items)[0])}
		<div class="flex items-center justify-between gap-4">
			<PersonBadge {person} />
			<div>
				<RegisterPersonForm person_id={person.id} eventIsPast={true} />
			</div>
		</div>
	{/snippet}
</DataGrid>
