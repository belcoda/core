<script lang="ts">
	export let data;
	import { create } from '$lib/schema/people/groups';
	import {
		Debug,
		Input,
		Button,
		Textarea,
		superForm,
		Grid,
		valibotClient,
		Error
	} from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(create)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.empty_neat_chipmunk_zip()} />

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			label={m.extra_wild_earthworm_commend()}
			{form}
			name="name"
			bind:value={$formData.name}
		/>
		<Textarea
			label={m.livid_spicy_felix_dance()}
			{form}
			name="description"
			bind:value={$formData.description as string}
		/>
		<Button type="submit">{m.just_away_horse_urge()}</Button>
		<Debug data={formData} />
	</Grid>
</form>
