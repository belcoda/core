<script lang="ts">
	type Logic = 'AND' | 'OR' | 'NOT';
	let { logic = $bindable() }: { logic: Logic } = $props();
	import * as Select from '$lib/comps/ui/select';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	const selectOptions = [
		{ value: 'AND', label: m.spry_top_skunk_link() },
		{ value: 'OR', label: m.agent_large_eagle_sew() },
		{ value: 'NOT', label: m.green_level_boar_grasp() }
	];
	let selected = $derived(selectOptions.find((option) => option.value === logic));
	function logicTypeGuard(input: unknown): input is Logic {
		return ['AND', 'OR', 'NOT'].includes(input as string);
	}
</script>

<Select.Root
	type="single"
	items={selectOptions}
	value={selected?.value}
	onValueChange={(val) => {
		if (!val) return;
		if (logicTypeGuard(val)) logic = val;
	}}
>
	<Select.Trigger class="w-[180px]">
		{selected?.label || '[Options]'}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each selectOptions as option}
				<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
