<script lang="ts">
	import { page } from '$app/stores';
	import { type Locality, defaultLocality } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultLocality) }: { item: Locality } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input bind:value={item.locality} placeholder={m.even_calm_sheep_wish()} />
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{m.helpful_quick_warthog_care()}</Label>
	</div>
</div>
