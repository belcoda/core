<script lang="ts">
	import { page } from '$app/stores';
	import { type PhoneNumber, defaultPhoneNumber } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultPhoneNumber) }: { item: PhoneNumber } = $props();
	import Input from '$lib/comps/ui/input/input.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<Input
			type="text"
			bind:value={item.phone_number}
			placeholder={$page.data.t.forms.fields.people.phone_number.label()}
		/>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.mustBeSubscribed} />
		<Label>{$page.data.t.forms.fields.filters.must_be_subscribed.label()}</Label>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.mustBeWhatsapp} />
		<Label>{$page.data.t.forms.fields.filters.must_have_whatsapp.label()}</Label>
	</div>
	<div class="flex items-center gap-4">
		<Checkbox bind:checked={item.partial} />
		<Label>{$page.data.t.forms.fields.filters.allow_partial_match.label()}</Label>
	</div>
</div>
