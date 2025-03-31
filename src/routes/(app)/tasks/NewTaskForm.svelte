<script lang="ts">
	import { page } from '$app/stores';
	import { type SuperValidated } from 'sveltekit-superforms';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import {
		Input,
		Button,
		DateTime,
		Error,
		HTML,
		Checkbox,
		Textarea,
		Grid,
		Switch,
		Code,
		Debug,
		superForm,
		valibotClient,
		type Infer
	} from '$lib/comps/ui/forms';
	import { create } from '$lib/schema/core/tasks';
	import * as m from '$lib/paraglide/messages';
	type Props = {
		superform: SuperValidated<Infer<typeof create>>;
		open: boolean;
	};
	let { superform, open = $bindable() }: Props = $props();

	const form = superForm(superform, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
</script>

<form use:enhance method="post" class="mt-4">
	<Grid cols={1}>
		<Error error={$message} />
		<Input
			{form}
			name="name"
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name}
		/>
		<Textarea
			{form}
			name="description"
			rows={1}
			label={m.livid_spicy_felix_dance()}
			bind:value={$formData.description as string}
		/>
		<Button type="submit"></Button>
		<Debug data={$formData} />
	</Grid>
</form>
