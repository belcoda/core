<script lang="ts">
	import { type FilterTypeRegisteredEvent } from '$lib/schema/people/filters/filters';
	let { item = $bindable() }: { item: FilterTypeRegisteredEvent } = $props();
	import EventDropdown from '$lib/comps/widgets/events/EventDropdown.svelte';
	import * as Select from '$lib/comps/ui/select';

	const statuses: { value: FilterTypeRegisteredEvent['status']; label: string }[] = [
		{ value: 'any', label: 'Any' },
		{ value: 'registered', label: 'Registered' },
		{ value: 'attended', label: 'Attended' },
		{ value: 'cancelled', label: 'Cancelled' },
		{ value: 'noshow', label: 'No show' }
	];
</script>

<div class="flex gap-4 items-center justify-start">
	<EventDropdown bind:value={item.event_id} onselect={(e) => (item.event_id = e.id)} />
	<Select.Root
		items={statuses}
		selected={statuses[0]}
		onSelectedChange={(val) => {
			if (!val) return;
			item.status = val.value;
		}}
	>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Event status" />
		</Select.Trigger>
		<Select.Content>
			{#each statuses as status}
				<Select.Item value={status.value} label={status.label}>{status.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
