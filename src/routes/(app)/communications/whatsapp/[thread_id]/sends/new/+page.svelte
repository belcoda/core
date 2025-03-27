<script lang="ts">
	const { data } = $props();
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { create } from '$lib/schema/communications/whatsapp/sends';
	import {
		superForm,
		valibotClient,
		Grid,
		Debug,
		Error,
		Button as FormButton
	} from '$lib/comps/ui/forms';
	import ListDropdown from '$lib/comps/widgets/lists/ListDropdown.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import Plus from 'lucide-svelte/icons/plus';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.each_alert_cougar_offer()} />
<form use:enhance method="post">
	<Grid cols={1} class="mt-4">
		<Error error={$message} />
		<div class="flex items-center gap-4">
			<ListDropdown bind:value={$formData.list_id}>
				<Plus size={14} />
				{m.vivid_grassy_leopard_fold()}
			</ListDropdown>
		</div>
		<FormButton>{m.merry_key_platypus_pray()}</FormButton>
		<Debug data={$formData} />
	</Grid>
</form>
