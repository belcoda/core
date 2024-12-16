<script lang="ts">
	import { page } from '$app/stores';
	import { type Address, defaultAddress } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultAddress) }: { item: Address } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input
			bind:value={item.address}
			placeholder={$page.data.t.forms.fields.address.address.label()}
		/>
	</div>
</div>
