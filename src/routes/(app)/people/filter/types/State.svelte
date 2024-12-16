<script lang="ts">
	import { page } from '$app/stores';
	import { type State, defaultState } from '$lib/schema/people/filters/defaults';

	let { item = $bindable(defaultState) }: { item: State } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input bind:value={item.state} placeholder={$page.data.t.forms.fields.address.state.label()} />
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{$page.data.t.forms.fields.filters.allow_partial_match.label()}</Label>
	</div>
</div>
