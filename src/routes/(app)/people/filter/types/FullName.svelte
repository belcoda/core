<script lang="ts">
	import { page } from '$app/stores';
	import { type FullName, defaultFullName } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultFullName) }: { item: FullName } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input bind:value={item.name} autocomplete="off" placeholder={m.empty_stock_rat_hush()} />
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{m.fuzzy_tidy_ray_hack()}</Label>
	</div>
</div>
