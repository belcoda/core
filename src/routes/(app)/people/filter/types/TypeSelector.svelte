<script lang="ts">
	import { page } from '$app/stores';
	import { type FilterType } from '$lib/schema/people/filters/filters';
	import { generateDefaultFilterValue } from './generateDefaultType';
	import { type DefaultFilterTypes } from '$lib/schema/people/filters/defaults';
	let { value = $bindable() }: { value: DefaultFilterTypes } = $props();
	import * as Select from '$lib/comps/ui/select/';
	const items: { value: FilterType['type']; label: string }[] = [
		{ value: 'full_name', label: 'Full Name' },
		{ value: 'email', label: 'Email address' },
		{ value: 'postcode', label: 'Postcode' },
		{ value: 'locality', label: 'Locality' },
		{ value: 'state', label: 'State' },
		{ value: 'address', label: 'Address' },
		{ value: 'phone_number', label: 'Phone number' },
		{ value: 'in_list', label: 'List member' },
		{ value: 'not_in_list', label: 'Not list member' },
		{ value: 'has_tag', label: 'Has tag' },
		{ value: 'not_has_tag', label: 'Does not have tag' },
		{ value: 'registered_event', label: 'Registered for event' },
		{ value: 'not_registered_event', label: 'Not registered for event' }
	];
	const label = $derived(
		items.find((item) => item.value === value.type)?.label ||
			$page.data.t.forms.fields.filters.filter_type.placeholder()
	);
</script>

<Select.Root
	{items}
	type="single"
	onValueChange={(val) => {
		value = generateDefaultFilterValue(val as DefaultFilterTypes['type']);
	}}
>
	<Select.Trigger class="md:w-[175px] w-full">
		{label}
	</Select.Trigger>
	<Select.Content>
		{#each items as item}
			<Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
