<script lang="ts">
	export let data;
	import { sendToList } from '$lib/schema/communications/email/sends';
	import {
		Debug,
		Button,
		superForm,
		Grid,
		SelectList,
		valibotClient,
		Error
	} from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(sendToList)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.acidic_shy_ray_win()}>
	{#snippet button()}
		<Button variant="default" size="sm">
			{m.that_safe_lark_peek()}
		</Button>
	{/snippet}
</PageHeader>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<SelectList
			buttonLabel={m.quick_that_finch_bless()}
			label={null}
			{form}
			name="list_id"
			bind:value={$formData.list_id as number}
		/>
		<Button type="submit">{m.true_minor_toad_hike()}</Button>
		<Debug data={formData} />
	</Grid>
</form>
