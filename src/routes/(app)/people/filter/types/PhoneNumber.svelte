<script lang="ts">
	import { page } from '$app/stores';
	import { type PhoneNumber, defaultPhoneNumber } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultPhoneNumber) }: { item: PhoneNumber } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input type="text" bind:value={item.phone_number} placeholder={m.quick_less_alpaca_buzz()} />
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.mustBeSubscribed} />
		<Label>{m.true_smug_starfish_value()}</Label>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.mustBeWhatsapp} />
		<Label>{m.north_plane_dolphin_earn()}</Label>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{m.seemly_level_deer_fry()}</Label>
	</div>
</div>
