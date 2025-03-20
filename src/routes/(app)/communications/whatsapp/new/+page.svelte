<script lang="ts">
	export let data;
	import { Grid, Input, Debug, Error, Button, superForm, valibotClient } from '$lib/comps/ui/forms';
	import { create } from '$lib/schema/communications/whatsapp/threads';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.aware_many_camel_zip()} />

<form method="post" use:enhance>
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			label={m.extra_wild_earthworm_commend()}
			{form}
			name="name"
			bind:value={$formData.name}
		/>
		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
