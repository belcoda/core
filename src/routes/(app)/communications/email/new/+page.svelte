<script lang="ts">
	export let data;
	import { create } from '$lib/schema/communications/email/sends';
	import { Debug, Input, Button, superForm, Grid, valibotClient, Error } from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(create)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.strong_loved_tadpole_breathe()} />

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			label={m.extra_wild_earthworm_commend()}
			{form}
			name="name"
			bind:value={$formData.name}
		/>
		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={formData} />
	</Grid>
</form>
