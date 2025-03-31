<script lang="ts">
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import {
		Debug,
		Grid,
		Error,
		Input,
		Checkbox,
		superForm,
		valibotClient
	} from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { update } from '$lib/schema/core/tags';
	const form = superForm(data.form, {
		validators: valibotClient(update)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.smug_agent_clownfish_ripple()} />
<form use:enhance method="POST" class="mt-6">
	<Grid cols={1}>
		<Error error={$message} />
		<Input
			{form}
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name as string}
			name="name"
		/>
		<Checkbox
			{form}
			label={m.crisp_short_cod_hope()}
			bind:checked={$formData.active as boolean}
			name="active"
		/>
		<div class="flex justify-end">
			<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
