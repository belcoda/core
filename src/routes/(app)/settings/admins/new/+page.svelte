<script>
	import { page } from '$app/stores';
	export let data;
	import * as m from '$lib/paraglide/messages';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { Input, Button, superForm, valibotClient, Debug } from '$lib/comps/ui/forms';
	import { create } from '$lib/schema/core/admin';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, errors: formErrors, enhance } = form;
</script>

<PageHeader title={m.grassy_crisp_tiger_drum()} />

<form method="post" use:enhance class="grid grid-cols-1 gap-4 mt-6">
	<Input
		{form}
		name="full_name"
		label={m.free_lower_bumblebee_tend()}
		bind:value={$formData.full_name}
	/>
	<Input
		{form}
		type="email"
		name="email"
		label={m.heroic_mean_poodle_absorb()}
		bind:value={$formData.email}
		description={m.suave_frail_bee_cook()}
	/>
	<Button type="submit" class="col-span-2">{m.just_away_horse_urge()}</Button>
	<Debug data={$formData} />
</form>
