<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import { Debug, Grid, Error, Input, superForm, valibotClient } from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { create } from '$lib/schema/core/tags';
	const form = superForm(data.form, {
		validators: valibotClient(create)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.gray_low_blackbird_spark()} />
<form use:enhance method="POST" class="mt-6">
	<Grid cols={1}>
		<Error error={$message} />
		<Input
			{form}
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name}
			name="name"
		/>
		<div class="flex justify-end">
			<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
