<script lang="ts">
	export let data;
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { Input, Debug, Error, Grid, superForm, valibotClient } from '$lib/comps/ui/forms';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { update } from '$lib/schema/communications/email/messages';
	const form = superForm(data.form, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	const { form: formData, message, enhance } = form;
	import EditMessageForm from '$lib/comps/forms/EditEmailMessageForm.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.ideal_fuzzy_grebe_cut()} />
<form method="post" use:enhance>
	<Grid cols={1}>
		<Error error={$message} />
		<EditMessageForm
			{form}
			messageId={data.message.id}
			previewText="preview_text"
			templateId="template_id"
			name="name"
			from="from"
			replyTo="reply_to"
			subject="subject"
			useHtmlAsText="use_html_for_plaintext"
			html="html"
			text="text"
		/>
		<div class="flex items-center justify-end">
			<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
