<script lang="ts">
	import { page } from '$app/stores';
	import { type FullName, defaultFullName } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultFullName) }: { item: FullName } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input
			bind:value={item.name}
			autocomplete="off"
			placeholder={$page.data.t.forms.fields.generic.full_name.label()}
		/>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{$page.data.t.forms.fields.filters.allow_partial_match.label()}</Label>
	</div>
</div>
