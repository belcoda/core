<script lang="ts">
	import { page } from '$app/stores';
	export let data;
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { Input, Button, superForm, valibotClient, Debug, Checkbox } from '$lib/comps/ui/forms';
	import { update } from '$lib/schema/core/admin';
	const form = superForm(data.form, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	const { form: formData, enhance } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.ideal_dark_tiger_scoop()} />

<form method="post" use:enhance class="grid grid-cols-1 gap-4 mt-6">
	<Input
		{form}
		name="full_name"
		label={m.great_awake_dragonfly_mend()}
		bind:value={$formData.full_name as string}
	/>
	<Input
		{form}
		type="url"
		name="profile_picture_url"
		label={m.stale_tidy_rooster_endure()}
		bind:value={$formData.profile_picture_url as string}
	/>
	<Checkbox {form} name="active" label="Active" bind:checked={$formData.active as boolean} />

	<Button type="submit" class="col-span-2">{m.just_away_horse_urge()}</Button>
	<Debug data={$formData} />
</form>
