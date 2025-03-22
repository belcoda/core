<script lang="ts">
	import { page } from '$app/stores';
	import { type Address, defaultAddress } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultAddress) }: { item: Address } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input bind:value={item.address} placeholder={m.busy_east_seahorse_stab()} />
	</div>
</div>
