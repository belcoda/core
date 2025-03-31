<script lang="ts">
	import { page } from '$app/stores';
	import { type Email, defaultEmail } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultEmail) }: { item: Email } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input type="email" bind:value={item.email} placeholder={m.heroic_mean_poodle_absorb()} />
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.mustBeSubscribed} />
		<Label>{m.knotty_round_weasel_feast()}</Label>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{m.jumpy_nice_snail_grin()}</Label>
	</div>
</div>
